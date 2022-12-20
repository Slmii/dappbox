import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { api } from 'api';
import { Chunk } from 'declarations/assets/assets.did';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { useAddAsset } from 'lib/hooks';
import { getAssetId } from 'lib/url';
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
	const fileRef = useRef<HTMLInputElement | null>(null);
	const folderRef = useRef<HTMLInputElement | null>(null);

	const [isUploadingFiles, setIsUploadingFiles] = useState(false);
	const [filesUploadSuccess, setFilesUploadSucces] = useState(false);
	const [isUploadingFolder, setIsUploadingFolder] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [totalFiles, setTotalFiles] = useState(0);
	const [currentFileIndex, setCurrentFileIndex] = useState(0);
	const [totalChunks, setTotalChunks] = useState(0);
	const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

	const { mutateAsync: addAssetMutate, reset: addAssetReset } = useAddAsset();
	const { mutateAsync: addChunkMutate } = useMutation({
		mutationFn: api.Chunk.addChunk
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

		// Creating folder
		setIsUploadingFolder(true);

		const [folderName] = files[0].webkitRelativePath.split('/');
		const parentId = getAssetId(pathname);

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
			}
		});

		// Creating folder finished
		setIsUploadingFolder(false);

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

		// Reset state
		setIsUploadingFiles(true);
		setFilesUploadSucces(false);

		const filesLength = files.length;
		setTotalFiles(filesLength);

		let folderCount = 0;
		for (const file of files) {
			folderCount += 1;
			setCurrentFileIndex(folderCount);

			console.log(`Uploading File ${folderCount}/${filesLength}`);

			const { blobs } = await getImage(file);

			const blobsLength = blobs.length;
			if (!blobsLength) {
				return;
			}

			setTotalChunks(blobsLength);
			console.log('Total chunks to upload', blobsLength);

			// Upload each blob seperatly
			const chunks: Chunk[] = [];
			for (const [index, blob] of blobs.entries()) {
				const counter = index + 1;
				setCurrentChunkIndex(counter);

				console.log(`Uploading chunk ${counter}/${blobsLength}`);

				const chunk = await addChunkMutate({
					blob,
					index
				});
				chunks.push(chunk);

				console.log(`Chunk ${counter} uploaded`, chunk);
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
				}
			});

			console.log('Done uploading Asset', asset, file);
			console.log('============');
		}

		// Set state accordingly
		setIsUploadingFiles(false);
		setFilesUploadSucces(true);
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

	const isLoading = isUploadingFiles || isUploadingFolder;

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
							disabled={isLoading}
							tooltip={isLoading ? 'No support for multiple uploads yet' : undefined}
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
				<Input id='upload-file' multiple type='file' onChange={handleOnFileUpload} ref={fileRef} />
				<Input id='upload-folder' type='file' onChange={handleOnFolderUpload} ref={folderRef} />
			</Box>
			<Snackbar
				open={isLoading}
				loader
				message={
					<>
						{isUploadingFolder ? (
							'Creating folder'
						) : (
							<>
								{totalFiles > 1 ? (
									<>
										Processing files {currentFileIndex}/{totalFiles}.&nbsp;
									</>
								) : null}
								Uploading chunks {currentChunkIndex}/{totalChunks}
							</>
						)}
					</>
				}
			/>
			<Snackbar
				open={filesUploadSuccess}
				message={`${totalFiles > 1 ? 'Assets' : 'Asset'} uploaded successfully`}
				onClose={() => setFilesUploadSucces(false)}
			/>
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
