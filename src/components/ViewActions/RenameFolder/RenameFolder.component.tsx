import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { constants } from 'lib/constants';
import { replaceArrayAtIndex } from 'lib/functions';
import { useUserAssets } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { renameFolderSchema } from 'lib/schemas';
import { Asset } from 'lib/types/Asset.types';
import { Box, Column } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Field } from 'ui-components/Field';
import { Form } from 'ui-components/Form';
import { CircularProgress } from 'ui-components/Progress';
import { Snackbar } from 'ui-components/Snackbar';
import { Body } from 'ui-components/Typography';
import { RenameFolderFormData } from '../ViewActions.types';

export const RenameFolder = () => {
	const queryClient = useQueryClient();
	const renameFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [renameOpenDialog, setRenameOpenDialog] = useState(false);
	const [handleOnConfirmRenameDialog, setHandleOnConfirmRenameDialog] = useState<() => void>(() => null);
	const [undoAsset, setUndoAsset] = useState<Asset | null>(null);
	const [{ selectedRows }, setTableState] = useRecoilState(tableStateAtom);

	const { data: assets } = useUserAssets();
	const {
		mutateAsync: editAssetMutate,
		isLoading: editAssetIsLoading,
		isSuccess: editAssetIsSuccess,
		reset: editAssetReset
	} = useMutation({
		mutationFn: api.Asset.editAsset,
		onSuccess: asset => {
			queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], (old: Asset[] | undefined) => {
				if (!old) {
					return [];
				}

				const index = old.findIndex(oldAsset => oldAsset.id === asset.id);
				if (index === -1) {
					return old;
				}

				return replaceArrayAtIndex(old, index, asset);
			});
		}
	});

	const handleOnRenameFolder = () => {
		setRenameOpenDialog(selectedRows.length === 1);
		setHandleOnConfirmRenameDialog(() => async (data: RenameFolderFormData) => {
			if (!assets) {
				return;
			}

			setRenameOpenDialog(false);

			// There must always be only 1 asset selected
			// for the rename functionality
			const asset = selectedRows[0];

			// Store assets in the state before the renaming happens
			// This will be used to undo the renaming
			setUndoAsset(asset);

			const updatedAsset = await editAssetMutate({
				asset_id: asset.id,
				name: [data.folderName],
				is_favorite: [asset.isFavorite],
				parent_id: asset.parentId ? [asset.parentId] : []
			});

			// Update selected rows
			setTableState(prevState => ({
				...prevState,
				selectedRows: replaceArrayAtIndex(assets, 0, updatedAsset)
			}));
		});
	};

	return (
		<>
			{selectedRows.length === 1 ? (
				<>
					<Button
						label='Rename'
						startIcon='edit'
						variant='outlined'
						color='inherit'
						onClick={handleOnRenameFolder}
					/>
					<Dialog
						title='Rename folder'
						onClose={() => setRenameOpenDialog(false)}
						open={renameOpenDialog}
						onConfirm={() =>
							// Programatically submit react hook form outside the form component
							renameFolderFormRef.current?.dispatchEvent(
								new Event('submit', { cancelable: true, bubbles: true })
							)
						}
					>
						<Box
							sx={{
								marginTop: constants.SPACING
							}}
						>
							<Form<RenameFolderFormData>
								action={handleOnConfirmRenameDialog}
								defaultValues={{
									folderName: selectedRows.length === 1 ? selectedRows[0].name : ''
								}}
								schema={renameFolderSchema}
								myRef={renameFolderFormRef}
								mode='onSubmit'
							>
								<Field name='folderName' label='Folder name' />
							</Form>
						</Box>
					</Dialog>
				</>
			) : null}
			<Snackbar
				open={editAssetIsLoading}
				message={
					<Column>
						<Body>Renaming asset</Body>
						<CircularProgress />
					</Column>
				}
			/>
			<Snackbar
				open={editAssetIsSuccess}
				message='Asset renamed successfully'
				onUndo={async () => {
					if (!undoAsset || !assets) {
						return;
					}

					// Apply `undo` assets
					await editAssetMutate({
						asset_id: undoAsset.id,
						name: [undoAsset.name],
						is_favorite: [undoAsset.isFavorite],
						parent_id: undoAsset.parentId ? [undoAsset.parentId] : []
					});

					// Update selected rows
					setTableState(prevState => ({
						...prevState,
						selectedRows: replaceArrayAtIndex(assets, 0, undoAsset)
					}));

					// Reset assets for `undo` functionality
					setUndoAsset(null);
					editAssetReset();
				}}
				onClose={() => {
					setUndoAsset(null);
					editAssetReset();
				}}
			/>
		</>
	);
};
