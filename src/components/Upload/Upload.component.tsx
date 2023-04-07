import { styled } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { api } from 'api';
import { Chunk, PostAsset } from 'declarations/assets/assets.did';
import { QUERY_USED_SPACE } from 'lib/constants/query-keys.constants';
import { SPACING } from 'lib/constants/spacing.constants';
import { MAX_UPLOAD_LIMIT } from 'lib/constants/upload.constants';
import { AuthContext } from 'lib/context';
import { useActivities, useAddAsset, useUserAssets } from 'lib/hooks';
import { FileWithActivity } from 'lib/types';
import { getAssetId, getUrlBreadcrumbs } from 'lib/url';
import { findExistingAsset, getExtension, getImage, validateUploadSize } from 'lib/utils/asset.utils';
import { formatBytes } from 'lib/utils/conversion.utils';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Menu } from 'ui-components/Menu';
import { Snackbar } from 'ui-components/Snackbar';

const Input = styled('input')({
	display: 'none'
});

export const Upload = () => {
	const { pathname } = useLocation();
	const { user } = useContext(AuthContext);
	const queryClient = useQueryClient();
	const fileRef = useRef<HTMLInputElement | null>(null);
	const folderRef = useRef<HTMLInputElement | null>(null);
	const { addActivity, updateActivity } = useActivities();

	const [uploadError, setUploadError] = useState<string | null>(null);

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

	const handleOnFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		// TODO: upload nested folder

		const files = e.target.files;

		if (!files || !files.length || !user) {
			return;
		}

		const isValid = validateUploadSize(files);
		if (!isValid) {
			setUploadError(`Max upload size is ${formatBytes(MAX_UPLOAD_LIMIT)}`);
			return;
		}

		const [folderName] = files[0].webkitRelativePath.split('/');
		const parentId = getAssetId(pathname);

		// Add folder activity
		const activityId = addActivity({
			name: folderName,
			type: 'folder',
			inProgress: true,
			isFinished: false
		});

		// Add activities for all files within the uploaded folder
		const filesWithActivityId = addActivities(files);

		// Create placeholderId
		const placeholderId = Date.now();

		// Create PostAsset data
		const postData: PostAsset & { placeholderId: number } = {
			placeholderId,
			id: [],
			asset_type: {
				Folder: null
			},
			chunks: [],
			extension: '',
			mime_type: '',
			name: folderName,
			parent_id: parentId ? [Number(parentId)] : [],
			size: 0,
			user_id: user.id,
			settings: {
				privacy: {
					Public: null
				},
				url: []
			}
		};

		// Add placeholder
		addPlaceholder(postData);

		// Upload selected folder as asset
		const asset = await addAssetMutate(postData);

		// Update cache with folder asset
		updateCache(placeholderId, () => ({ ...asset, placeholder: false }));

		// Update folder activity
		updateActivity(activityId, {
			inProgress: false,
			isFinished: true,
			href: getUrlBreadcrumbs(asset.id, [asset, ...(assets ?? [])])
		});

		// Upload files inside the selected folder
		await uploadFiles(filesWithActivityId, asset.id);
	};

	const handleOnFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files || !files.length) {
			return;
		}

		const isValid = validateUploadSize(files);
		if (!isValid) {
			setUploadError(`Max upload size is ${formatBytes(MAX_UPLOAD_LIMIT)}`);
			return;
		}

		// Add activities for selected files
		const filesWithActivityId = addActivities(files);

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
			// Set existing asset id
			postData.id = existingAsset?.id ? [existingAsset.id] : [];

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

	const addActivities = (files: FileList) => {
		// Add activities for all files within the uploaded folder
		const filesWithActivityId: FileWithActivity[] = Array.from(files).map(file => {
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
						await handleOnFileUpload(e);
						e.target.value = '';
					}}
					ref={fileRef}
				/>
				<Input
					id='upload-folder'
					type='file'
					onChange={async e => {
						await handleOnFolderUpload(e);
						e.target.value = '';
					}}
					ref={folderRef}
				/>
			</Box>
			<Snackbar
				open={!!uploadError}
				message={uploadError ?? ''}
				onClose={() => {
					setUploadError(null);
					addAssetReset();
				}}
			/>
		</>
	);
};
