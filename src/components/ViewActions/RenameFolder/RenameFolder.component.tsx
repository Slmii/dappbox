import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { constants } from 'lib/constants';
import { replaceAsset } from 'lib/functions';
import { useUserAssets } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { renameFolderSchema } from 'lib/schemas';
import { Asset } from 'lib/types/Asset.types';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Field } from 'ui-components/Field';
import { Form } from 'ui-components/Form';
import { Snackbar } from 'ui-components/Snackbar';
import { RenameFolderFormData } from '../ViewActions.types';

export const RenameFolder = () => {
	const queryClient = useQueryClient();
	const renameFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [renameOpenDialog, setRenameOpenDialog] = useState(false);
	const [handleOnConfirmRenameDialog, setHandleOnConfirmRenameDialog] = useState<() => void>(() => null);
	const [undoAssets, setUndoAssets] = useState<Asset[]>([]);
	const { data: assets } = useUserAssets();

	const [{ selectedRows }, setTableState] = useRecoilState(tableStateAtom);

	const handleOnRenameFolder = () => {
		setRenameOpenDialog(selectedRows.length === 1);
		setHandleOnConfirmRenameDialog(() => (data: RenameFolderFormData) => {
			if (!assets) {
				return;
			}

			// There should always be only 1 asset selected
			// for the rename functionality
			const index = assets.findIndex(asset => asset.id === selectedRows[0].id);

			// Store assets in the state before the renaming happens
			// This will be used to undo the renaming
			setUndoAssets(assets);

			// TODO: mutate canister
			// TODO: update cache in react query or invalidate query after udpdate
			// TODO: move to useMutation call
			queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], () => {
				return replaceAsset({
					assets,
					value: {
						...assets[index],
						name: data.folderName
					},
					index
				});
			});

			setRenameOpenDialog(false);

			// Reset selected rows
			setTableState(prevState => ({
				...prevState,
				selectedRows: []
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
				open={!!undoAssets.length}
				message='Folder renamed successfully'
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
