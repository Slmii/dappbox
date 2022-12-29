import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { constants } from 'lib/constants';
import { useUserAssets } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { renameFolderSchema } from 'lib/schemas';
import { Asset } from 'lib/types';
import { getExtension, replaceArrayAtIndex } from 'lib/utils';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Field } from 'ui-components/Field';
import { Form } from 'ui-components/Form';
import { Snackbar } from 'ui-components/Snackbar';
import { RenameAssetFormData } from '../Actions.types';

export const Rename = () => {
	const queryClient = useQueryClient();
	const renameFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [renameOpenDialog, setRenameOpenDialog] = useState(false);
	const [handleOnConfirmRenameDialog, setHandleOnConfirmRenameDialog] = useState<() => void>(() => null);
	const [undoAsset, setUndoAsset] = useState<Asset | null>(null);
	const [{ selectedAssets }, setTableState] = useRecoilState(tableStateAtom);

	const { data: assets } = useUserAssets();
	const {
		mutateAsync: editAssetMutate,
		isLoading: editAssetIsLoading,
		isSuccess: editAssetIsSuccess,
		reset: editAssetReset
	} = useMutation({
		mutationFn: api.Assets.editAsset,
		onSuccess: asset => {
			queryClient.setQueriesData<Asset[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				// Find the index of the renamed asset in the current cache
				const index = old.findIndex(oldAsset => oldAsset.id === asset.id);
				if (index === -1) {
					return old;
				}

				// Replace the renamed asset in the currence cache
				const updatedAssets = replaceArrayAtIndex(old, index, asset);

				// Update selected rows
				setTableState(prevState => ({
					...prevState,
					selectedAssets: replaceArrayAtIndex(prevState.selectedAssets, 0, asset)
				}));

				return updatedAssets;
			});
		}
	});

	const handleOnRenameFolder = () => {
		setRenameOpenDialog(selectedAssets.length === 1);
		setHandleOnConfirmRenameDialog(() => async (data: RenameAssetFormData) => {
			if (!assets) {
				return;
			}

			setRenameOpenDialog(false);

			// There must always be only 1 asset selected
			// for the rename functionality
			const asset = selectedAssets[0];

			// Store assets in the state before the renaming happens
			// This will be used to undo the renaming
			setUndoAsset(asset);

			await editAssetMutate({
				id: asset.id,
				name: [data.folderName],
				extension: asset.type === 'file' ? [getExtension(data.folderName)] : [],
				is_favorite: [asset.isFavorite],
				parent_id: asset.parentId ? [asset.parentId] : []
			});
		});
	};

	return (
		<>
			{selectedAssets.length === 1 ? (
				<>
					<Button
						label='Rename'
						startIcon='edit'
						variant='outlined'
						color='inherit'
						onClick={handleOnRenameFolder}
					/>
					<Dialog
						title='Rename asset'
						onClose={() => {
							setRenameOpenDialog(false);
							setHandleOnConfirmRenameDialog(() => null);
						}}
						open={renameOpenDialog}
						onConfirm={() =>
							// Programatically submit react hook form outside the form component
							renameFolderFormRef.current?.dispatchEvent(
								new Event('submit', { cancelable: true, bubbles: true })
							)
						}
						onConfirmText='Rename'
					>
						<Box
							sx={{
								marginTop: constants.SPACING
							}}
						>
							<Form<RenameAssetFormData>
								action={handleOnConfirmRenameDialog}
								defaultValues={{
									folderName: selectedAssets.length === 1 ? selectedAssets[0].name : ''
								}}
								schema={renameFolderSchema}
								myRef={renameFolderFormRef}
								mode='onSubmit'
							>
								<Field name='folderName' label='Asset name' autoFocus />
							</Form>
						</Box>
					</Dialog>
				</>
			) : null}
			<Snackbar open={editAssetIsLoading} message='Renaming asset' loader />
			<Snackbar
				open={editAssetIsSuccess}
				message='Asset renamed successfully'
				onUndo={async () => {
					if (!undoAsset) {
						return;
					}

					// Apply `undo` assets
					await editAssetMutate({
						id: undoAsset.id,
						name: [undoAsset.name],
						extension: [getExtension(undoAsset.name)],
						is_favorite: [undoAsset.isFavorite],
						parent_id: undoAsset.parentId ? [undoAsset.parentId] : []
					});

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
