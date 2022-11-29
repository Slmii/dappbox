import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { constants } from 'lib/constants';
import { useUserAssets } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Asset } from 'lib/types/Asset.types';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Snackbar } from 'ui-components/Snackbar';

export const Delete = () => {
	const queryClient = useQueryClient();
	const [deleteOpenDialog, setDeleteOpenDialog] = useState(false);
	const [undoAssets, setUndoAssets] = useState<Asset[]>([]);

	const { data: assets, getNestedChildAssets } = useUserAssets();
	const [{ selectedRows }, setTableState] = useRecoilState(tableStateAtom);

	const handleOnConfirmDeleteAssets = () => {
		// Make a copy of the current assets
		let replacingAssets = [...(assets ?? [])];

		setUndoAssets(replacingAssets);

		// Get all assets + nested child assets
		const assetsToDelete = selectedRows
			.map(row => {
				const nestedRows = getNestedChildAssets(row.id);
				return [row, ...nestedRows];
			})
			.flat();

		replacingAssets = replacingAssets.filter(asset => {
			return !assetsToDelete.map(asset => asset.id).includes(asset.id);
		});

		// TODO: mutate canister
		// TODO: update cache in react query or invalidate query after udpdate
		// TODO: move to useMutation call
		queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], () => {
			return replacingAssets;
		});

		setDeleteOpenDialog(false);

		// Reset selected rows
		setTableState(prevState => ({
			...prevState,
			selectedRows: []
		}));
	};

	return (
		<>
			{selectedRows.length ? (
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
			<Snackbar
				open={!!undoAssets.length}
				message='Asset(s) deleted successfully'
				onUndo={() => {
					// Apply `undo` assets
					// TODO: mutate canister
					// TODO: update cache in react query or invalidate query after udpdate
					// TODO: move to useMutation call
					queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], () => {
						return undoAssets;
					});

					// Reset assets for `undo` functionality
					setUndoAssets([]);
				}}
				onClose={() => setUndoAssets([])}
			/>
		</>
	);
};
