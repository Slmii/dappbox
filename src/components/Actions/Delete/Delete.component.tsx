import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { QUERY_USED_SPACE, QUERY_USER_ASSETS } from 'lib/constants/query-keys.constants';
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
			queryClient.setQueriesData<Asset[]>([QUERY_USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				return old.filter(asset => !deletedAssets.includes(asset.id));
			});

			await queryClient.invalidateQueries([QUERY_USED_SPACE]);
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

		// Add activity for all selected assets to be deleted
		const activityId = addActivity({
			inProgress: true,
			isFinished: false,
			name: selectedAssets.map(asset => asset.name).join(', '),
			type: 'delete'
		});

		const assetsToDelete = selectedAssets.map(asset => [asset, ...getNestedChildAssets(asset.id)]).flat();
		try {
			await deleteChunksMutate({
				chunkIds: assetsToDelete.map(asset => asset.chunks.map(chunk => chunk.id)).flat(),
				canisterPrincipal: user.canisters[0]
			});
			await deleteAssetsMutate(assetsToDelete.map(asset => asset.id));

			// Mark as finished
			updateActivity(activityId, { inProgress: false, isFinished: true });

			// Reset selected rows
			setTableState(prevState => ({
				...prevState,
				selectedAssets: []
			}));
		} catch (error) {
			// Mark as error
			updateActivity(activityId, { inProgress: false, error: (error as Error).message });
		}
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
