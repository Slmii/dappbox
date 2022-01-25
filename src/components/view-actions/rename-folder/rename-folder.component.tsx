import { useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { constants } from 'lib/constants';
import { replaceAsset } from 'lib/functions';
import { Asset } from 'lib/generated/dappbox_types';
import { assetsAtom, tableStateAtom } from 'lib/recoil';
import { renameFolderSchema } from 'lib/schemas';
import { Box } from 'ui-components/box';
import { Button } from 'ui-components/button';
import { Dialog } from 'ui-components/dialog';
import { Field } from 'ui-components/field';
import { Form } from 'ui-components/form';
import { Snackbar } from 'ui-components/snackbar';
import { RenameFolderFormData } from '../view-actions.types';

export const RenameFolder = () => {
	const renameFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [renameOpenDialog, setRenameOpenDialog] = useState(false);
	const [handleOnConfirmRenameDialog, setHandleOnConfirmRenameDialog] = useState<() => void>(() => null);
	const [undoAssets, setUndoAssets] = useState<Asset[]>([]);

	const [{ assets }, setAssets] = useRecoilState(assetsAtom);
	const { selectedRows } = useRecoilValue(tableStateAtom);

	const handleOnRenameFolder = () => {
		setRenameOpenDialog(selectedRows.length === 1);
		setHandleOnConfirmRenameDialog(() => (data: RenameFolderFormData) => {
			// There should always be only 1 asset selected
			// for the rename functionality
			const index = assets.findIndex(asset => asset.assetId === selectedRows[0].assetId);

			// Store assets in the state before the renaming happens
			// This will be used to undo the renaming
			setUndoAssets(assets);

			setAssets(prevState => ({
				...prevState,
				assets: replaceAsset({
					assets,
					value: {
						...assets[index],
						name: data.folderName
					},
					index
				})
			}));

			setRenameOpenDialog(false);
		});
	};

	return (
		<>
			<Button label='Rename' startIcon='edit' variant='outlined' color='inherit' onClick={handleOnRenameFolder} />
			<Dialog
				title='Rename folder'
				onClose={() => setRenameOpenDialog(false)}
				open={renameOpenDialog}
				onConfirm={() =>
					// Programatically submit react hook form outside the form component
					renameFolderFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
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
			<Snackbar
				open={!!undoAssets.length}
				message='Folder renamed successfully'
				onUndo={() => {
					setAssets(prevState => ({
						...prevState,
						assets: undoAssets
					}));
					setUndoAssets([]);
				}}
				onClose={() => setUndoAssets([])}
			/>
		</>
	);
};
