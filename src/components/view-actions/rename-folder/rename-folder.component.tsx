import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { constants } from 'lib/constants';
import { replaceAsset } from 'lib/functions';
import { assetsAtom, tableStateAtom } from 'lib/recoil';
import { renameFolderSchema } from 'lib/schemas';
import { Box } from 'ui-components/box';
import { Button } from 'ui-components/button';
import { Dialog } from 'ui-components/dialog';
import { Field } from 'ui-components/field';
import { Form } from 'ui-components/form';
import { RenameFolderFormData } from '../view-actions.types';

export const RenameFolder = () => {
	const renameFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [renameOpenDialog, setRenameOpenDialog] = useState(false);
	const [handleOnConfirmRenameDialog, setHandleOnConfirmRenameDialog] = useState<() => void>(() => null);

	const [{ assets }, setAssets] = useRecoilState(assetsAtom);
	const [{ selectedRows }, setTableState] = useRecoilState(tableStateAtom);

	const handleOnRenameFolder = () => {
		setRenameOpenDialog(selectedRows.length === 1);
		setHandleOnConfirmRenameDialog(() => (data: RenameFolderFormData) => {
			// There should always be only 1 asset selected
			// for the rename functionality
			const index = assets.findIndex(asset => asset.assetId === selectedRows[0].assetId);

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
			setTableState(prevState => ({
				...prevState,
				selectedRows: []
			}));
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
		</>
	);
};
