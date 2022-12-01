import { styled } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { api } from 'api';
import { Chunk } from 'declarations/assets/assets.did';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { getImage } from 'lib/functions';
import { Asset } from 'lib/types/Asset.types';
import { getAssetId } from 'lib/url';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';

const Input = styled('input')({
	display: 'none'
});

export const Upload = () => {
	const { pathname } = useLocation();
	const queryClient = useQueryClient();
	const { user } = useContext(AuthContext);

	const { mutateAsync: addAssetMutate, isLoading: addAssetIsLoading } = useMutation({
		mutationFn: api.Asset.addAsset,
		onSuccess: asset => {
			queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], (old: Asset[] | undefined) => {
				return [asset, ...(old ?? [])];
			});
		}
	});

	const { mutateAsync: addChunkMutate, isLoading: addChunkIsLoading } = useMutation({
		mutationFn: api.Asset.addChunk
	});

	const handleOnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files || !user) {
			return;
		}

		const file = files[0];
		const { blobs } = await getImage(file);

		// Upload each blob seperatly
		const chunks: Chunk[] = [];
		for (const blob of blobs) {
			const chunk = await addChunkMutate(blob);
			chunks.push(chunk);
		}

		const parentId = getAssetId(pathname);
		await addAssetMutate({
			asset_type: 'file',
			extension: file.name.split('.').pop() ?? '',
			name: file.name,
			parent_id: !!parentId ? [Number(parentId)] : [],
			user_id: user.id,
			mime_type: file.type,
			chunks,
			size: file.size
		});
	};

	const isLoading = addAssetIsLoading || addChunkIsLoading;

	return (
		<Box sx={{ padding: constants.SPACING }}>
			<label htmlFor='upload-file'>
				<Input id='upload-file' /*multiple*/ type='file' onChange={handleOnUpload} />
				<Button
					startIcon='addOutlined'
					label={isLoading ? 'Uploading...' : 'Upload'}
					variant='contained'
					color='primary'
					size='large'
					fullWidth
					// @ts-ignore
					component='span'
					sx={{
						borderRadius: 50
					}}
					loading={isLoading}
				/>
			</label>
		</Box>
	);
};
