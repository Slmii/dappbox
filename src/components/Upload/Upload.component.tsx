import { styled } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { api } from 'api';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { getImage } from 'lib/functions';
import { Asset } from 'lib/types/Asset.types';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';

const Input = styled('input')({
	display: 'none'
});

export const Upload = () => {
	const queryClient = useQueryClient();
	const { user } = useContext(AuthContext);

	const { mutateAsync, isLoading, error } = useMutation({
		mutationFn: api.Asset.addAsset,
		onSuccess: asset => {
			queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], (old: Asset[] | undefined) => {
				return [...(old ?? []), asset];
			});
		}
	});

	const handleOnUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files || !user) {
			return;
		}

		const file = files[0];
		const { payload } = await getImage(file);

		await mutateAsync({
			type: 'file',
			extension: file.name.split('.').pop() ?? '',
			name: file.name,
			parentId: undefined,
			userId: user.id,
			mimeType: file.type,
			blobs: payload
		});
	};

	console.log({ error });

	return (
		<Box sx={{ padding: constants.SPACING }}>
			<label htmlFor='upload-file'>
				<Input id='upload-file' multiple type='file' onChange={handleOnUpload} />
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
