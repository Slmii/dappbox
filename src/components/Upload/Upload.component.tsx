import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useContext, useState } from 'react';
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
import { Snackbar } from 'ui-components/Snackbar';

const Input = styled('input')({
	display: 'none'
});

export const Upload = () => {
	const { pathname } = useLocation();
	const { user } = useContext(AuthContext);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [assetsUploadSuccess, setAssetsUploadSucces] = useState(false);
	const [totalFiles, setTotalFiles] = useState(0);
	const [currentFileIndex, setCurrentFileIndex] = useState(0);
	const [totalChunks, setTotalChunks] = useState(0);
	const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

	const { mutateAsync: addAssetMutate, isLoading: addAssetIsLoading, reset: addAssetReset } = useAddAsset();

	const { mutateAsync: addChunkMutate, isLoading: addChunkIsLoading } = useMutation({
		mutationFn: api.Chunk.addChunk
	});

	const handleOnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files || !files.length || !user) {
			return;
		}

		// Convert FilesList to array
		const filesAsArray = Array.from(files);

		// Max size validation
		if (filesAsArray.some(file => file.size > constants.MAX_UPLOAD_LIMIT)) {
			setUploadError(`Max upload size is ${formatBytes(constants.MAX_UPLOAD_LIMIT)}`);
			return;
		}

		const filesLength = filesAsArray.length;
		setTotalFiles(filesLength);

		for (const [index, file] of filesAsArray.entries()) {
			const counter = index + 1;
			setCurrentFileIndex(counter);

			console.log(`Uploading File ${counter}/${filesLength}`);

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

			const parentId = getAssetId(pathname);
			const asset = await addAssetMutate({
				asset_type: {
					File: null
				},
				extension: getExtension(file.name),
				name: file.name,
				parent_id: !!parentId ? [Number(parentId)] : [],
				user_id: user.id,
				mime_type: file.type,
				chunks,
				size: file.size
			});

			console.log('Done uploading Asset', asset, file);
			console.log('============');
		}

		setAssetsUploadSucces(true);
	};

	const isLoading = addAssetIsLoading || addChunkIsLoading;

	return (
		<>
			<Box sx={{ padding: constants.SPACING }}>
				<label htmlFor='upload-file'>
					<Input id='upload-file' multiple type='file' onChange={handleOnUpload} />
					<Button
						startIcon='addOutlined'
						label='Upload'
						variant='contained'
						color='primary'
						size='large'
						fullWidth
						disabled={isLoading}
						tooltip={isLoading ? 'No support for multiple uploads yet' : undefined}
						// @ts-ignore
						component='span'
						sx={{
							borderRadius: 50
						}}
					/>
				</label>
			</Box>
			<Snackbar
				open={isLoading}
				loader
				message={
					<>
						{totalFiles > 1 ? (
							<>
								Processing files {currentFileIndex}/{totalFiles}.&nbsp;
							</>
						) : null}
						Uploading chunks {currentChunkIndex}/{totalChunks}
					</>
				}
			/>
			<Snackbar
				open={assetsUploadSuccess}
				message='Asset uploaded successfully'
				onClose={() => setAssetsUploadSucces(false)}
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
