import { styled } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { api } from 'api';
import { Chunk } from 'declarations/assets/assets.did';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { useActivities, useAddAsset, useUserAssets } from 'lib/hooks';
import { getAssetId, getUrlPathToAsset } from 'lib/url';
import { formatBytes, getExtension, getImage } from 'lib/utils';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Menu } from 'ui-components/Menu';
import { Snackbar } from 'ui-components/Snackbar';

const Input = styled('input')({
	display: 'none'
});

// TODO: overrwrite exising files

export const Upload = () => {
	const { pathname } = useLocation();
	const { user } = useContext(AuthContext);
	const queryClient = useQueryClient();
	const fileRef = useRef<HTMLInputElement | null>(null);
	const folderRef = useRef<HTMLInputElement | null>(null);
	const { activities, addActivity, updateActivity } = useActivities();

	const [uploadError, setUploadError] = useState<string | null>(null);

	const { data: assets } = useUserAssets();
	const { mutateAsync: addAssetMutate, reset: addAssetReset } = useAddAsset();
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
		const files = e.target.files;

		if (!files || !files.length || !user) {
			return;
		}

		const isValid = validateUploadSize(files);
		if (!isValid) {
			return;
		}

		const [folderName] = files[0].webkitRelativePath.split('/');
		const parentId = getAssetId(pathname);

		// TODO: fix counter when uploading a folder
		// Create an ID and insert a new activity
		const activityId = activities.length + 1;
		addActivity({
			id: activityId,
			name: folderName,
			type: 'folder',
			inProgress: true
		});

		// Upload selected folder as asset
		const asset = await addAssetMutate({
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
			},
			nft: []
		});

		// Update activity
		updateActivity(activityId, {
			inProgress: false,
			progress: 100,
			href: getUrlPathToAsset(asset.id, [asset, ...(assets ?? [])])
				.map(asset => encodeURIComponent(asset.id))
				.join('/')
		});

		// Upload files inside the selected folder
		await uploadFiles(files, asset.id);
	};

	const handleOnFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files || !files.length) {
			return;
		}

		const isValid = validateUploadSize(files);
		if (!isValid) {
			return;
		}

		// Upload selected files
		const parentId = getAssetId(pathname);
		await uploadFiles(files, parentId ? Number(parentId) : undefined);
	};

	const uploadFiles = async (files: FileList, parentId?: number) => {
		if (!user) {
			return;
		}

		const filesLength = files.length;

		let filesCount = 0;
		for (const file of files) {
			filesCount += 1;

			console.log(`Uploading File ${filesCount}/${filesLength}`);

			const { blobs } = await getImage(file);

			const blobsLength = blobs.length;
			if (!blobsLength) {
				return;
			}

			// Create an ID and insert a new activity
			const activityId = activities.length + 1;
			addActivity({
				id: activityId,
				name: file.name,
				type: 'file',
				inProgress: true,
				// If there is only 1 chunk to upload then there is no need to show a determinate progress bar
				progress: blobsLength > 1 ? 0 : undefined
			});

			console.log('Total chunks to upload', blobsLength);

			// Upload each blob seperatly
			const chunks: Chunk[] = [];
			for (const [index, blob] of blobs.entries()) {
				const counter = index + 1;

				console.log(`Uploading chunk ${counter}/${blobsLength}`);

				const chunk = await addChunkMutate({
					chunk: {
						blob,
						index
					},
					canisterPrincipal: user.canisters[0]
				});
				chunks.push(chunk);

				console.log(`Chunk ${counter} uploaded`, chunk);

				// Update activity
				updateActivity(activityId, activity => ({
					progress: (activity.progress ?? 0) + 100 / blobsLength
				}));
			}

			console.log('Uploading Asset...');

			const asset = await addAssetMutate({
				asset_type: {
					File: null
				},
				extension: getExtension(file.name),
				name: file.name,
				parent_id: parentId ? [parentId] : [],
				user_id: user?.id,
				mime_type: file.type,
				chunks,
				size: file.size,
				settings: {
					privacy: {
						Public: null
					},
					url: []
				},
				nft: []
			});

			console.log('Done uploading Asset', asset, file);
			console.log('============');

			// Update activity
			updateActivity(activityId, {
				inProgress: false,
				progress: 100
			});
		}

		await queryClient.invalidateQueries([constants.QUERY_KEYS.USED_SPACE]);
	};

	const validateUploadSize = (files: FileList) => {
		// Convert FilesList to array
		const filesAsArray = Array.from(files);

		// Max size validation
		if (filesAsArray.some(file => file.size > constants.MAX_UPLOAD_LIMIT)) {
			setUploadError(`Max upload size is ${formatBytes(constants.MAX_UPLOAD_LIMIT)}`);
			return false;
		}

		return true;
	};

	return (
		<>
			<Box sx={{ padding: constants.SPACING }}>
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
