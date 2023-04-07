import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { QUERY_USER_ASSETS } from 'lib/constants/query-keys.constants';
import { SPACING } from 'lib/constants/spacing.constants';
import { useActivities, useUserAssets } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { renameFolderSchema } from 'lib/schemas';
import { Activity, Asset } from 'lib/types';
import { getExtension } from 'lib/utils/asset.utils';
import { replaceArrayAtIndex } from 'lib/utils/conversion.utils';
import { Alert } from 'ui-components/Alert';
import { Box, Row } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Field } from 'ui-components/Field';
import { Form } from 'ui-components/Form';
import { RenameAssetFormData } from '../Actions.types';

export const Rename = () => {
	const queryClient = useQueryClient();
	const renameFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [renameOpenDialog, setRenameOpenDialog] = useState(false);
	const [handleOnConfirmRenameDialog, setHandleOnConfirmRenameDialog] = useState<() => void>(() => null);
	const [{ selectedAssets }, setTableState] = useRecoilState(tableStateAtom);

	const { addActivity, updateActivity } = useActivities();
	const { data: assets } = useUserAssets();
	const { mutateAsync: editAssetMutate } = useMutation({
		mutationFn: api.Assets.editAsset,
		onSuccess: asset => {
			queryClient.setQueriesData<Asset[]>([QUERY_USER_ASSETS], old => {
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

			// Add rename activity
			const activityId = addActivity({
				inProgress: true,
				isFinished: false,
				name: data.folderName,
				oldName: asset.name,
				type: 'rename',
				onUndo: activity => handleOnUndo(asset, activity)
			});

			try {
				await editAssetMutate({
					id: asset.id,
					name: [data.folderName],
					extension: asset.type === 'file' ? [getExtension(data.folderName)] : [],
					is_favorite: [asset.isFavorite],
					parent_id: asset.parentId ? [asset.parentId] : []
				});

				// Mark rename activity as finished
				updateActivity(activityId, { isFinished: true, inProgress: false });
			} catch (error) {
				// Mark rename activity as error
				updateActivity(activityId, {
					inProgress: false,
					error: (error as Error).message
				});
			}
		});
	};

	const handleOnUndo = async (asset: Asset, previousActivity: Activity) => {
		// Reset the previous activity's onUndo button
		updateActivity(previousActivity.id, { onUndo: undefined });

		// Add onUndo activity
		const undoActivityId = addActivity({
			inProgress: true,
			isFinished: false,
			name: asset.name,
			oldName: previousActivity.name,
			type: 'rename',
			isUndo: true
		});

		// Apply `undo` assets
		await editAssetMutate({
			id: asset.id,
			name: [asset.name],
			extension: [getExtension(asset.name)],
			is_favorite: [asset.isFavorite],
			parent_id: asset.parentId ? [asset.parentId] : []
		});

		// Mark the onUndo activity as finished
		updateActivity(undoActivityId, { isFinished: true, inProgress: false });
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
								marginTop: SPACING
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
								<Row>
									{selectedAssets[0].type === 'file' ? (
										<Alert>
											Changing the file extention (
											<b>{selectedAssets[0].name.split('.').pop()}</b>) will change the file type
										</Alert>
									) : null}
									<Field name='folderName' label='Asset name' autoFocus />
								</Row>
							</Form>
						</Box>
					</Dialog>
				</>
			) : null}
		</>
	);
};
