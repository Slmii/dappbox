import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { constants } from 'lib/constants';
import { tableStateAtom } from 'lib/recoil';
import { Asset } from 'lib/types/Asset.types';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Snackbar } from 'ui-components/Snackbar';

export const Delete = () => {
	const queryClient = useQueryClient();
	const [deleteOpenDialog, setDeleteOpenDialog] = useState(false);

	const [{ selectedAssets }, setTableState] = useRecoilState(tableStateAtom);

	const {
		mutateAsync: deleteAssetsMutate,
		isSuccess: deleteAssetsIsSuccess,
		isLoading: deleteAssetsIsLoading,
		reset: deleteAssetsReset
	} = useMutation({
		mutationFn: api.Asset.deleteAssets,
		onSuccess: async deletedAssets => {
			queryClient.setQueriesData<Asset[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				return old.filter(asset => !deletedAssets.includes(asset.id));
			});

			await queryClient.invalidateQueries([constants.QUERY_KEYS.USED_SPACE]);
		}
	});

	const handleOnConfirmDeleteAssets = async () => {
		if (!selectedAssets.length) {
			return;
		}

		setDeleteOpenDialog(false);

		await deleteAssetsMutate(selectedAssets.map(asset => asset.id));

		// Reset selected rows
		setTableState(prevState => ({
			...prevState,
			selectedAssets: []
		}));
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
			<Snackbar open={deleteAssetsIsLoading} message='Deleting assets' loader />
			<Snackbar open={deleteAssetsIsSuccess} message='Assets deleted successfully' onClose={deleteAssetsReset} />
		</>
	);
};
