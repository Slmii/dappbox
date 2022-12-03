import { styled } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { api } from 'api';
import { Chunk } from 'declarations/assets/assets.did';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { getExtension, getImage } from 'lib/functions';
import { Asset } from 'lib/types/Asset.types';
import { getAssetId } from 'lib/url';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Snackbar } from 'ui-components/Snackbar';
import { Body } from 'ui-components/Typography';

const Input = styled('input')({
	display: 'none'
});

export const Upload = () => {
	const { pathname } = useLocation();
	const queryClient = useQueryClient();
	const { user } = useContext(AuthContext);
	const [totalChunks, setTotalChunks] = useState(0);
	const [currentChunk, setCurrentChunk] = useState(0);

	const {
		mutateAsync: addAssetMutate,
		isLoading: addAssetIsLoading,
		isSuccess: addAssetIsSuccess,
		reset: addAssetReset
	} = useMutation({
		mutationFn: api.Asset.addAsset,
		onSuccess: asset => {
			queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], (old: Asset[] | undefined) => {
				if (!old) {
					return [];
				}

				return [asset, ...old];
			});
		}
	});

	const { mutateAsync: addChunkMutate, isLoading: addChunkIsLoading } = useMutation({
		mutationFn: api.Chunk.addChunk
	});

	const handleOnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files || !user) {
			return;
		}

		const file = files[0];
		const { blobs } = await getImage(file);

		const blobsLength = blobs.length;
		if (!blobsLength) {
			return;
		}

		let counter = 1;

		setTotalChunks(blobsLength);
		console.log('Total chunks to upload', blobsLength);
		console.log('============');

		// Upload each blob seperatly
		const chunks: Chunk[] = [];
		for (const [index, blob] of blobs.entries()) {
			console.log(`Uploading chunk ${counter}/${blobsLength}`);

			setCurrentChunk(counter);

			const chunk = await addChunkMutate({
				blob,
				index
			});
			chunks.push(chunk);

			console.log(`Chunk ${counter} uploaded`, chunk);
			counter++;
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

		console.log('Done', asset);
	};

	const isLoading = addAssetIsLoading || addChunkIsLoading;

	return (
		<>
			<Box sx={{ padding: constants.SPACING }}>
				<label htmlFor='upload-file'>
					<Input id='upload-file' /*multiple*/ type='file' onChange={handleOnUpload} />
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
					<Body>
						Uploading chunks {currentChunk}/{totalChunks}
					</Body>
				}
			/>
			<Snackbar open={addAssetIsSuccess} message='Asset uploaded successfully' onClose={addAssetReset} />
		</>
	);
};
