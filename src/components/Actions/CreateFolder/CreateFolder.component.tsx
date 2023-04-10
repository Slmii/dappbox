import { useContext, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { PostAsset } from 'declarations/assets/assets.did';
import { SPACING } from 'lib/constants/spacing.constants';
import { AuthContext } from 'lib/context';
import { useActivities, useAddAsset, useUserAssets } from 'lib/hooks';
import { createFolderSchema } from 'lib/schemas';
import { getAssetId, getUrlBreadcrumbs } from 'lib/url';
import { Alert } from 'ui-components/Alert';
import { Box, Row } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Field } from 'ui-components/Field';
import { Form } from 'ui-components/Form';
import { CreateFolderFormData } from '../Actions.types';

export const CreateFolder = () => {
	const { user } = useContext(AuthContext);
	const { pathname } = useLocation();
	const { addActivity, updateActivity } = useActivities();
	const createFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [createFolderOpenDialog, setCreateFolderOpenDialog] = useState(false);
	const [handleOnConfirmCreateFolderDialog, setHandleOnConfirmCreateFolderDialog] = useState<() => void>(() => null);
	const [folderExists, setFolderExists] = useState(false);

	const { data: assets } = useUserAssets();
	const { mutateAsync: addAssetMutate, updateCache, addPlaceholder } = useAddAsset();

	const handleOnCreateFolder = () => {
		setCreateFolderOpenDialog(true);
		setHandleOnConfirmCreateFolderDialog(() => async (data: CreateFolderFormData) => {
			if (!user) {
				return;
			}

			// Reset folderExists
			setFolderExists(false);

			let parentId = getAssetId(pathname);
			parentId = parentId?.length ? parentId : undefined;

			// Find existing asset
			const existingAsset = assets?.find(asset => asset.name === data.folderName && asset.parentId === parentId);
			if (!!existingAsset) {
				// Set folderExists to true
				return setFolderExists(true);
			}

			setCreateFolderOpenDialog(false);

			// Insert a new activity
			const activityId = addActivity({
				name: data.folderName,
				type: 'folder',
				inProgress: true,
				isFinished: false
			});

			// Create placeholderId
			const placeholderId = Date.now();

			// Create PostAsset data
			const postData: PostAsset & { placeholderId: number } = {
				placeholderId,
				id: [],
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
				}
			};

			// Add placeholder
			addPlaceholder(postData);

			// Upload selected folder as asset
			const asset = await addAssetMutate(postData);

			// Update cache with folder asset
			updateCache(placeholderId, () => ({ ...asset, placeholder: false }));

			// Update activity
			updateActivity(activityId, {
				inProgress: false,
				isFinished: true,
				href: getUrlBreadcrumbs(asset.id, [asset, ...(assets ?? [])])
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
						marginTop: SPACING
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
						<Row>
							<Alert>
								This folder will be created inside{' '}
								<b>
									{assets?.find(asset => asset.id === Number(getAssetId(pathname)))?.name ?? 'Home'}
								</b>
							</Alert>
							{folderExists ? (
								<Alert severity='error'>A folder with this name already exists</Alert>
							) : null}
							<Field name='folderName' label='Folder name' autoFocus />
						</Row>
					</Form>
				</Box>
			</Dialog>
		</>
	);
};
