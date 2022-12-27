import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { tableStateAtom } from 'lib/recoil';
import { Asset } from 'lib/types/Asset.types';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Snackbar } from 'ui-components/Snackbar';

export const Delete = () => {
	const queryClient = useQueryClient();
	const { user } = useContext(AuthContext);
	const [deleteOpenDialog, setDeleteOpenDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const [{ selectedAssets }, setTableState] = useRecoilState(tableStateAtom);

	const { mutateAsync: deleteAssetsMutate } = useMutation({
		mutationFn: api.Assets.deleteAssets,
		onSuccess: async deletedAssets => {
			queryClient.setQueriesData<Asset[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				return old.filter(asset => !deletedAssets.includes(asset.id));
			});
		}
	});

	const { mutateAsync: deleteChunksMutate } = useMutation({
		mutationFn: api.Chunks.deleteChunks
	});

	const handleOnConfirmDeleteAssets = async () => {
		if (!selectedAssets.length || !user) {
			return;
		}

		setDeleteOpenDialog(false);
		setIsLoading(true);
		setIsSuccess(false);

		await deleteAssetsMutate(selectedAssets.map(asset => asset.id));
		await deleteChunksMutate(
			selectedAssets
				.map(asset => asset.chunks)
				.flat()
				.map(chunk => chunk.id)
		);

		// Reset selected rows
		setTableState(prevState => ({
			...prevState,
			selectedAssets: []
		}));

		setIsLoading(false);
		setIsSuccess(true);
	};

	return (
		<>
			{selectedAssets.length ? (
				<>
					<Button label='Delete' startIcon='delete' color='error' onClick={() => setDeleteOpenDialog(true)} />
					<Dialog
						title='Delete assets?'
						onClose={() => setDeleteOpenDialog(false)}
						open={deleteOpenDialog}
						onConfirm={handleOnConfirmDeleteAssets}
						onConfirmText='Delete'
						onCancelText='Cancel'
						text='Are you sure you want to delete the selected assets?'
					/>
				</>
			) : null}
			<Snackbar open={isLoading} message='Deleting assets' loader />
			<Snackbar
				open={isSuccess}
				message='Assets deleted successfully'
				onClose={() => {
					setIsLoading(false);
					setIsSuccess(false);
				}}
			/>
		</>
	);
};
