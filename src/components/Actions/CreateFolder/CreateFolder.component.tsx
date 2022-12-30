import { useContext, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { useActivities, useAddAsset, useUserAssets } from 'lib/hooks';
import { createFolderSchema } from 'lib/schemas';
import { getAssetId, getUrlPathToAsset } from 'lib/url';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Field } from 'ui-components/Field';
import { Form } from 'ui-components/Form';
import { CreateFolderFormData } from '../Actions.types';

export const CreateFolder = () => {
	const { user } = useContext(AuthContext);
	const { pathname } = useLocation();
	const { activities, addActivity, updateActivity } = useActivities();
	const createFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [createFolderOpenDialog, setCreateFolderOpenDialog] = useState(false);
	const [handleOnConfirmCreateFolderDialog, setHandleOnConfirmCreateFolderDialog] = useState<() => void>(() => null);

	const { data: assets } = useUserAssets();
	const { mutateAsync: addAssetMutate } = useAddAsset();

	const handleOnCreateFolder = () => {
		setCreateFolderOpenDialog(true);
		setHandleOnConfirmCreateFolderDialog(() => async (data: CreateFolderFormData) => {
			if (!user) {
				return;
			}

			setCreateFolderOpenDialog(false);

			// Create an ID and insert a new activity
			const activityId = activities.id + 1;
			addActivity({
				id: activityId,
				name: data.folderName,
				type: 'folder',
				inProgress: true
			});

			const parentId = getAssetId(pathname);
			const asset = await addAssetMutate({
				asset_type: {
					Folder: null
				},
				chunks: [],
				extension: '',
				mime_type: '',
				name: data.folderName,
				parent_id: parentId ? [Number(parentId)] : [],
				size: 0,
				user_id: user.id,
				settings: {
					privacy: {
						Public: null
					},
					url: []
				},
				nft: []
			});

			// Update activity
			updateActivity(activityId, {
				inProgress: false,
				progress: 100,
				href: getUrlPathToAsset(asset.id, [asset, ...(assets ?? [])])
					.map(asset => encodeURIComponent(asset.id))
					.join('/')
			});
		});
	};

	return (
		<>
			<Button
				label='Create folder'
				startIcon='addFolderOutlined'
				variant='contained'
				color='primary'
				onClick={handleOnCreateFolder}
			/>
			<Dialog
				title='Create folder'
				onClose={() => {
					setCreateFolderOpenDialog(false);
					setHandleOnConfirmCreateFolderDialog(() => null);
				}}
				open={createFolderOpenDialog}
				onConfirm={() =>
					// Programatically submit react hook form outside the form component
					createFolderFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
				}
				onConfirmText='Create'
			>
				<Box
					sx={{
						marginTop: constants.SPACING
					}}
				>
					<Form<CreateFolderFormData>
						action={handleOnConfirmCreateFolderDialog}
						defaultValues={{
							folderName: ''
						}}
						schema={createFolderSchema}
						myRef={createFolderFormRef}
						mode='onSubmit'
					>
						<Field name='folderName' label='Folder name' autoFocus />
					</Form>
				</Box>
			</Dialog>
		</>
	);
};
