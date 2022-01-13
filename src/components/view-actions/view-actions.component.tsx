import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { replaceAsset } from 'lib/functions';
import { assetsAtom, tableStateAtom } from 'lib/recoil';
import { renameFolderSchema } from 'lib/schemas';
import { Box } from 'ui-components/box';
import { Button } from 'ui-components/button';
import { Dialog } from 'ui-components/dialog';
import { Field } from 'ui-components/field';
import { Form } from 'ui-components/form';
import { Caption } from 'ui-components/typography';

export const ViewActions = () => {
	const renameFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [renameOpenDialog, setRenameOpenDialog] = useState(false);
	const [handleOnConfirmRenameDialog, setHandleOnConfirmRenameDialog] = useState<() => void>(() => null);

	const [{ assets }, setAssets] = useRecoilState(assetsAtom);
	const [{ selectedRows }, setTableState] = useRecoilState(tableStateAtom);

	const handleOnRenameFolder = () => {
		setRenameOpenDialog(selectedRows.length === 1);
		setHandleOnConfirmRenameDialog(() => (data: any) => {
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

			setTableState(prevState => ({
				...prevState,
				selectedRows: []
			}));
			setRenameOpenDialog(false);
		});
	};

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					'& > *:not(:last-child)': {
						marginRight: 1
					}
				}}
			>
				<Button
					label='Add folder'
					startIcon='addFolderOutlined'
					variant='contained'
					color='inherit'
					sx={{
						color: 'black'
					}}
				/>
				{selectedRows.length > 0 ? (
					<>
						{selectedRows.length === 1 ? (
							<>
								{selectedRows[0].assetType === 'folder' ? (
									<Button
										label='Rename'
										startIcon='edit'
										variant='outlined'
										color='inherit'
										onClick={handleOnRenameFolder}
									/>
								) : (
									<Button label='Preview' startIcon='view' variant='outlined' color='inherit' />
								)}
							</>
						) : null}
						<Button label='Download' startIcon='download' variant='outlined' color='inherit' />
						<Button label='Move' variant='outlined' startIcon='folder' color='inherit' />
						<Button label='Copy' startIcon='copy' variant='outlined' color='inherit' />
						<Button label='Delete' startIcon='delete' color='error' />
						<Box
							sx={{
								marginLeft: 'auto'
							}}
						>
							<Caption title={`${selectedRows.length} selected`} />
						</Box>
					</>
				) : null}
			</Box>
			<Dialog
				title='Rename folder'
				onClose={() => setRenameOpenDialog(false)}
				open={renameOpenDialog}
				onConfirm={() =>
					// Programatically submit react hook form outside the form component
					renameFolderFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
				}
			>
				<Form
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
			</Dialog>
		</>
	);
};
