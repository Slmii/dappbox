import { styled } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { api } from 'api';
import { Chunk, PostAsset } from 'declarations/assets/assets.did';
import { QUERY_USED_SPACE } from 'lib/constants/query-keys.constants';
import { SPACING } from 'lib/constants/spacing.constants';
import { AuthContext } from 'lib/context';
import { useActivities, useAddAsset, useUserAssets } from 'lib/hooks';
import { FileWithActivity } from 'lib/types';
import { getAssetId } from 'lib/url';
import {
	addNestedFileActivities,
	buildNestedFiles,
	countFilesAndFolders,
	findExistingAsset,
	getExtension,
	getImage,
	setPostAsset,
	validateUploadSize
} from 'lib/utils/asset.utils';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Menu } from 'ui-components/Menu';

const Input = styled('input')({
	display: 'none'
});

export const Upload = () => {
	const { pathname } = useLocation();
	const { user } = useContext(AuthContext);
	const queryClient = useQueryClient();
	const fileRef = useRef<HTMLInputElement | null>(null);
	const folderRef = useRef<HTMLInputElement | null>(null);

	const [isLargeFile, setIsLargeFile] = useState(false);
	const [largeFiles, setLargeFiles] = useState<File[]>([]);
	const [fileOrFolder, setFileOrFolder] = useState<'file' | 'folder' | undefined>(undefined);

	const { addActivity, updateActivity } = useActivities();
	const { data: assets } = useUserAssets();
	const {
		mutateAsync: addAssetMutate,
		reset: addAssetReset,
		updateCache,
		addPlaceholder,
		removePlaceholder
	} = useAddAsset();
	const { mutateAsync: addChunkMutate } = useMutation({
		mutationFn: api.Chunks.addChunk
	});

	// https://github.com/facebook/react/pull/3644#issuecomment-91627671
	useEffect(() => {
		if (folderRef.current !== null) {
			folderRef.current.setAttribute('directory', '');
			folderRef.current.setAttribute('webkitdirectory', '');
			folderRef.current.setAttribute('mozdirectory', '');
		}
	}, [folderRef]);

	const handleOnFolderUpload = async (files: File[], skipValidation = false) => {
		if (!Array.from(files).length || !user || !assets) {
			return;
		}

		const isValid = validateUploadSize(files);
		if (!skipValidation && !isValid) {
			setIsLargeFile(true);
			setLargeFiles(Array.from(files));
			setFileOrFolder('folder');
			return;
		}

		// Build nested files and folders
		const nestedFiles = buildNestedFiles(files);

		// Count files and folders
		const { files: filesCount, folders: foldersCount } = countFilesAndFolders(nestedFiles);
		const totalCount = filesCount + foldersCount;
		let counter = 0;

		// Get folder name of the first file, aka root folder
		const folderName = Object.keys(nestedFiles)[0];

		// Get parentId from url
		let parentId = getAssetId(pathname);

		const activityId = addActivity({
			name: folderName,
			type: 'folder',
			inProgress: true,
			isFinished: false
		});

		await addNestedFileActivities(nestedFiles, {
			// TODO: cleanup this mess and split it up into smaller functions. Basically does the same as uploadFiles
			onFile: async file => {
				const { blobs } = await getImage(file);
				if (!blobs.length) {
					return;
				}

				counter += 1;
				updateActivity(activityId, {
					name: `${folderName} (${counter}/${totalCount})`
				});

				// Create placeholderId
				const placeholderId = Date.now();

				// Create PostAsset data
				const postData = setPostAsset({
					placeholderId,
					name: file.name,
					parentId: parentId ? Number(parentId) : undefined,
					userId: user.id,
					assetType: 'file',
					extension: getExtension(file.name),
					mimeType: file.type,
					size: file.size
				});

				// Find existing asset
				const existingAsset = findExistingAsset(assets, postData);
				if (!!existingAsset) {
					// Set existing asset id. id is used to recognize an existing asset and replace it with the new one
					postData.id = [existingAsset.id];
				}

				// Add placeholder
				addPlaceholder(postData);

				let skipUpload = false;

				// Upload each blob seperatly
				const chunks: Chunk[] = [];
				try {
					for (const [index, blob] of blobs.entries()) {
						const chunk = await addChunkMutate({
							chunk: {
								blob,
								index
							},
							canisterPrincipal: user.canisters[0]
						});
						chunks.push(chunk);
					}
				} catch (error) {
					// Update activity with error
					updateActivity(activityId, { inProgress: false, error: (error as Error).message });

					// Remove placeholder
					removePlaceholder(placeholderId);

					skipUpload = true;
				}

				// Skip upload if there was an error
				if (skipUpload) {
					return;
				}

				// Add asset
				postData.chunks = chunks;
				const asset = await addAssetMutate(postData);

				// Update cache with asset
				updateCache(placeholderId, () => ({ ...asset, chunks, placeholder: false }));
			},
			onFolder: async name => {
				counter += 1;
				updateActivity(activityId, {
					name: `${folderName} (${counter}/${totalCount})`
				});

				// Create placeholderId
				const placeholderId = Date.now();

				// Create PostAsset data
				const postData = setPostAsset({
					placeholderId,
					name,
					parentId: parentId ? Number(parentId) : undefined,
					userId: user.id,
					assetType: 'folder',
					extension: '',
					mimeType: '',
					size: 0
				});

				// Find existing asset
				const existingAsset = findExistingAsset(assets, postData);
				if (!!existingAsset) {
					// Set existing asset id. id is used to recognize an existing asset and replace it with the new one
					postData.id = [existingAsset.id];
				}

				// Add placeholder
				addPlaceholder(postData);

				// Upload folder
				const asset = await addAssetMutate(postData);
				// Set parentId to the newly created folder
				parentId = asset.id.toString();

				// Update cache to remove placeholder
				updateCache(placeholderId, () => ({ ...asset, placeholder: false }));
			}
		});

		// Update folder activity
		updateActivity(activityId, {
			inProgress: false,
			isFinished: true
		});
	};

	const handleOnFileUpload = async (files: File[], skipValidation = false) => {
		if (!files.length) {
			return;
		}

		const isValid = validateUploadSize(files);
		if (!skipValidation && !isValid) {
			setIsLargeFile(true);
			setLargeFiles(Array.from(files));
			setFileOrFolder('file');
			return;
		}

		// Add activities for selected files
		const filesWithActivityId = addFileActivities(files);

		// Upload selected files
		const parentId = getAssetId(pathname);
		await uploadFiles(filesWithActivityId, parentId ? Number(parentId) : undefined);
	};

	const uploadFiles = async (filesWithActivityId: FileWithActivity[], parentId?: number) => {
		if (!user) {
			return;
		}

		const filesLength = filesWithActivityId.length;

		let filesCount = 0;
		for (const { file, activityId } of filesWithActivityId) {
			// Update activity to be in progress
			updateActivity(activityId, {
				inProgress: true
			});

			filesCount += 1;

			console.log(`Uploading File ${filesCount}/${filesLength}`);

			const { blobs } = await getImage(file);

			const blobsLength = blobs.length;
			if (!blobsLength) {
				return;
			}

			console.log('Total chunks to upload', blobsLength);
			if (blobsLength > 1) {
				// Update activity with total chunks
				updateActivity(activityId, {
					totalChunks: blobsLength,
					currentChunk: 1
				});
			}

			console.log('Uploading Asset...');

			// Create placeholderId
			const placeholderId = Date.now();

			// Create PostAsset data
			const postData: PostAsset & { placeholderId: number } = {
				placeholderId,
				id: [],
				asset_type: {
					File: null
				},
				extension: getExtension(file.name),
				name: file.name,
				parent_id: parentId ? [parentId] : [],
				user_id: user.id,
				mime_type: file.type,
				chunks: [],
				size: file.size,
				settings: {
					privacy: {
						Public: null
					},
					url: []
				}
			};

			// Find existing asset
			const existingAsset = findExistingAsset(assets ?? [], postData);
			if (!!existingAsset) {
				// Set existing asset id. id is used to recognize an existing asset and replace it with the new one
				postData.id = [existingAsset.id];
			}

			// Add placeholder
			addPlaceholder(postData);

			let skipUpload = false;

			// Upload each blob seperatly
			const chunks: Chunk[] = [];
			try {
				for (const [index, blob] of blobs.entries()) {
					const counter = index + 1;
					console.log(`Uploading chunk ${counter}/${blobsLength}`);

					// Update activity with current chunk
					updateActivity(activityId, {
						currentChunk: counter
					});

					const chunk = await addChunkMutate({
						chunk: {
							blob,
							index
						},
						canisterPrincipal: user.canisters[0]
					});
					chunks.push(chunk);

					console.log(`Chunk ${counter} uploaded`, chunk);
				}
			} catch (error) {
				// Update activity with error
				updateActivity(activityId, { inProgress: false, error: (error as Error).message });

				// Remove placeholder
				removePlaceholder(placeholderId);

				skipUpload = true;
			}

			// Skip upload if there was an error
			if (skipUpload) {
				continue;
			}

			// Add asset
			const asset = await addAssetMutate({
				...postData,
				chunks
			});

			// Update cache with asset
			updateCache(placeholderId, () => ({ ...asset, chunks, placeholder: false }));

			console.log('Done uploading Asset', asset, file);
			console.log('============');

			// Update activity
			updateActivity(activityId, {
				inProgress: false,
				isFinished: true
			});
		}

		await queryClient.invalidateQueries([QUERY_USED_SPACE]);
	};

	const addFileActivities = (files: File[]) => {
		// Add activities for all files within the uploaded folder
		const filesWithActivityId: FileWithActivity[] = files.map(file => {
			// Insert a new activity
			const activityId = addActivity({
				name: file.name,
				type: 'file',
				inProgress: false,
				isFinished: false
			});

			return {
				file,
				activityId
			};
		});

		return filesWithActivityId;
	};

	return (
		<>
			<Box sx={{ padding: SPACING }}>
				<Menu
					fullWidth
					label={
						<Button
							startIcon='addOutlined'
							label='Upload'
							variant='contained'
							color='primary'
							size='large'
							fullWidth
							sx={{
								borderRadius: 50
							}}
						/>
					}
					id='upload'
					menu={[
						{
							label: 'File',
							icon: 'uploadFile',
							action: () => fileRef.current?.click()
						},
						{
							label: 'Folder',
							icon: 'uploadFolder',
							action: () => folderRef.current?.click()
						}
					]}
				/>
				<Input
					id='upload-file'
					multiple
					type='file'
					onChange={async e => {
						if (e.target.files) {
							await handleOnFileUpload(Array.from(e.target.files));
						}

						e.target.value = '';
					}}
					ref={fileRef}
				/>
				<Input
					id='upload-folder'
					type='file'
					onChange={async e => {
						if (e.target.files) {
							await handleOnFolderUpload(Array.from(e.target.files));
						}
						e.target.value = '';
					}}
					ref={folderRef}
				/>
			</Box>
			<Dialog
				onClose={() => setIsLargeFile(false)}
				onConfirm={async () => {
					// Close dialog
					setIsLargeFile(false);

					if (typeof largeFiles === 'undefined' || typeof fileOrFolder === 'undefined') {
						return;
					}

					// Upload files
					if (fileOrFolder === 'file') {
						await handleOnFileUpload(largeFiles, true);
					} else {
						await handleOnFolderUpload(largeFiles, true);
					}

					setLargeFiles([]);
					setFileOrFolder(undefined);
				}}
				open={isLargeFile}
				title='File too large'
				onConfirmText='Yes'
				text='The file you are trying to upload is large and may take a while to process. Do you want to continue?'
			/>
		</>
	);
};
