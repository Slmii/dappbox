import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { useActivities, useUserAssets } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Asset } from 'lib/types';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';

export const Delete = () => {
	const queryClient = useQueryClient();
	const { user } = useContext(AuthContext);
	const [deleteOpenDialog, setDeleteOpenDialog] = useState(false);

	const { addActivity, updateActivity } = useActivities();
	const [{ selectedAssets }, setTableState] = useRecoilState(tableStateAtom);

	const { getNestedChildAssets } = useUserAssets();
	const { mutateAsync: deleteAssetsMutate } = useMutation({
		mutationFn: api.Assets.deleteAssets,
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

	const { mutateAsync: deleteChunksMutate } = useMutation({
		mutationFn: api.Chunks.deleteChunks
	});

	const handleOnConfirmDeleteAssets = async () => {
		if (!selectedAssets.length || !user) {
			return;
		}

		setDeleteOpenDialog(false);

		// Add activities for all selected assets to be deleted
		const activityIds = selectedAssets.map(asset =>
			addActivity({ inProgress: true, isFinished: false, name: asset.name, type: 'delete' })
		);

		const assetsToDelete = selectedAssets.map(asset => [asset, ...getNestedChildAssets(asset.id)]).flat();
		await deleteAssetsMutate(assetsToDelete.map(asset => asset.id));
		await deleteChunksMutate(assetsToDelete.map(asset => asset.chunks.map(chunk => chunk.id)).flat());

		// Mark all as finished
		activityIds.forEach(activityId => updateActivity(activityId, { inProgress: false, isFinished: true }));

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
		</>
	);
};
