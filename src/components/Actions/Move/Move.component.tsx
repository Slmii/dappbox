import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { constants } from 'lib/constants';
import { getTableAssets, replaceArrayAtIndex } from 'lib/functions';
import { useUserAssets } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Asset } from 'lib/types/Asset.types';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { IconButton } from 'ui-components/IconButton';
import { AssetsList } from 'ui-components/List';
import { Snackbar } from 'ui-components/Snackbar';
import { MoveFolderBreadcrumbs } from './Breadcrumbs.component';

export const Move = () => {
	const queryClient = useQueryClient();
	const [moveFolderDialogOpen, setMoveFolderDialogOpen] = useState(false);
	// State of the selected folder for the items to move
	const [selectedFolderAssetId, setSelectedFolderAssetId] = useState<number>(0);
	// State for showing children of the selected folder
	const [parentAssetId, setParentAssetId] = useState<number>(0);
	const [undoAssets, setUndoAssets] = useState<Asset[]>([]);

	const { data: assets, getChildAssets, getParentId, getRootParent } = useUserAssets();
	const [{ selectedRows }, setTableState] = useRecoilState(tableStateAtom);

	const {
		mutateAsync: moveAssetMutate,
		isLoading: moveAssetsIsLoading,
		isSuccess: moveAssetsIsSuccess,
		reset: moveAssetsReset
	} = useMutation({
		mutationFn: api.Asset.moveAssets,
		onSuccess: movedAssets => {
			queryClient.setQueriesData<Asset[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				let updatedAssets = [...old];

				for (const movedAsset of movedAssets) {
					// Find the index of the moved asset in the current cache
					const index = old.findIndex(oldAsset => oldAsset.id === movedAsset.id);

					if (index !== -1) {
						// Replace the moved asset in the currence cache
						updatedAssets = replaceArrayAtIndex(updatedAssets, index, {
							...updatedAssets[index],
							parentId: movedAsset.parentId
						});
					}
				}

				return updatedAssets;
			});
		}
	});

	const folderAssets = useMemo(() => {
		if (!assets) {
			return [];
		}

		return getTableAssets({
			assets,
			order: 'asc',
			orderBy: 'name',
			assetId: parentAssetId
		}).filter(asset => asset.type === 'folder');
	}, [assets, parentAssetId]);

	// Filter out assets who cannot be moved to the same folder or if the folder asset is being moved to a child
	const assetsToMove = useMemo(() => {
		return selectedRows.filter(asset => {
			const parentId = getParentId(asset.id);

			// Asset's parentId cannot be the same as the selected folder's assetId
			// This means that an asset cannot be moved to the current position of the tree, because
			// the asset is already there
			if (parentId === selectedFolderAssetId) {
				return false;
			}

			// Asset's Id cannot be the same as the selected folder's assetId
			// This means that an asset cannot be moved to its own position in the tree
			if (asset.id === selectedFolderAssetId) {
				return false;
			}

			if (asset.type === 'folder') {
				const rootAsset = getRootParent(asset.id);

				// If root (meaning the asset has no parentId)
				if (rootAsset) {
					// If the root's assetId is equal to the selected folder asset id, then
					// it's not allowed to move, because it's unnecessary to move an asset
					// to its own location in the tree
					if (rootAsset.id !== selectedFolderAssetId) {
						// Get root asset of the selected folder
						const rootAssetOfSelectedFolder = getRootParent(selectedFolderAssetId);

						// The root asset of the selected folder cannot be the same as the
						// assetId of the root asset to be moved.
						// If this is the case, it means that the user is trying to move
						// the root asset to one of its children in the tree
						return rootAssetOfSelectedFolder?.id === rootAsset.id ? false : true;
					}

					// Root by default is always allowed to move
					return true;
				}

				// This check is required if you want to move a folder to a lower positon in the tree, within the same tree
				// Example:
				// A1 > A2 > A3
				// Moving A1 to a lower position is not allowed, same as moving A2 to A3 is not allowed (only for folders)
				return getChildAssets(asset.id).length > 0 ? false : true;
			}

			return true;
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFolderAssetId]);

	const handleOnMoveFolder = () => {
		setMoveFolderDialogOpen(selectedRows.length > 0);
	};

	const handleOnFolderNavigation = (assetId: number) => {
		setSelectedFolderAssetId(0);
		setParentAssetId(assetId);
	};

	const resetState = () => {
		setSelectedFolderAssetId(0);
		setParentAssetId(0);
		setMoveFolderDialogOpen(false);
	};

	const handleOnConfirmMoveAssets = async () => {
		if (!assetsToMove.length || !assets?.length) {
			return;
		}

		resetState();
		setUndoAssets(assets);

		await moveAssetMutate(
			assetsToMove.map(asset => ({
				id: asset.id,
				parent_id: [selectedFolderAssetId]
			}))
		);

		// Reset selected rows
		setTableState(prevState => ({
			...prevState,
			selectedRows: []
		}));
	};

	return (
		<>
			{selectedRows.length ? (
				<>
					<Button
						label='Move'
						variant='outlined'
						startIcon='folderMove'
						color='inherit'
						onClick={handleOnMoveFolder}
					/>
					<Dialog
						title='Move asset'
						onClose={resetState}
						open={moveFolderDialogOpen}
						onConfirm={handleOnConfirmMoveAssets}
						// Disable if no parent folder has been selected
						onConfirmDisabled={selectedFolderAssetId === 0 || !assetsToMove.length}
						onConfirmText='Move here'
					>
						<MoveFolderBreadcrumbs
							parentAssetId={parentAssetId}
							onBreadcrumbClick={handleOnFolderNavigation}
						/>
						<AssetsList
							assets={folderAssets.map(asset => ({
								id: asset.id,
								isSelected: asset.id === selectedFolderAssetId,
								name: asset.name,
								icon: 'folder',
								onClick: setSelectedFolderAssetId,
								secondaryAction: getChildAssets(asset.id).filter(asset => asset.type === 'folder')
									.length ? (
									<IconButton
										icon='next'
										label='Go to folder'
										onClick={() => handleOnFolderNavigation(asset.id)}
									/>
								) : undefined
							}))}
						/>
					</Dialog>
				</>
			) : null}
			<Snackbar open={moveAssetsIsLoading} message='Moving assets' loader />
			<Snackbar
				open={moveAssetsIsSuccess}
				message='Assets moved successfully'
				onUndo={async () => {
					if (!undoAssets.length) {
						return;
					}

					await moveAssetMutate(
						undoAssets.map(asset => ({
							id: asset.id,
							parent_id: asset.parentId ? [asset.parentId] : []
						}))
					);

					setUndoAssets([]);
					moveAssetsReset();
				}}
				onClose={() => {
					setUndoAssets([]);
					moveAssetsReset();
				}}
			/>
		</>
	);
};
