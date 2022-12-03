import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { api } from 'api';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { getTableAssets } from 'lib/functions';
import { tableStateAtom } from 'lib/recoil';
import { createFolderSchema } from 'lib/schemas';
import { Asset } from 'lib/types/Asset.types';
import { getAssetId } from 'lib/url';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { Field } from 'ui-components/Field';
import { Form } from 'ui-components/Form';
import { Snackbar } from 'ui-components/Snackbar';
import { CreateFolderFormData } from '../ViewActions.types';

export const CreateFolder = () => {
	const { user } = useContext(AuthContext);
	const { pathname } = useLocation();
	const queryClient = useQueryClient();
	const createFolderFormRef = useRef<null | HTMLFormElement>(null);
	const [createFolderOpenDialog, setCreateFolderOpenDialog] = useState(false);
	const [handleOnConfirmCreateFolderDialog, setHandleOnConfirmCreateFolderDialog] = useState<() => void>(() => null);

	const { order, orderBy } = useRecoilValue(tableStateAtom);

	const { mutateAsync: addAssetMutate, isLoading: addAssetIsLoading } = useMutation({
		mutationFn: api.Asset.addAsset,
		onSuccess: asset => {
			queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], (old: Asset[] | undefined) => {
				if (!old) {
					return [];
				}

				const newAssets = [asset, ...(old ?? [])];

				return getTableAssets({
					assets: newAssets,
					order,
					orderBy,
					assetId: getAssetId(pathname)
				});
			});
		}
	});

	const handleOnCreateFolder = () => {
		setCreateFolderOpenDialog(true);
		setHandleOnConfirmCreateFolderDialog(() => async (data: any) => {
			if (!user) {
				return;
			}

			setCreateFolderOpenDialog(false);

			const parentId = getAssetId(pathname);
			await addAssetMutate({
				asset_type: {
					Folder: null
				},
				chunks: [],
				extension: '',
				mime_type: '',
				name: data.folderName,
				parent_id: parentId ? [Number(parentId)] : [],
				size: 0,
				user_id: user.id
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
						<Field name='folderName' label='Folder name' />
					</Form>
				</Box>
			</Dialog>
			<Snackbar open={addAssetIsLoading} message='Creating folder' loader />
		</>
	);
};
