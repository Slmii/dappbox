import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { QUERY_USER_ASSETS } from 'lib/constants/query-keys.constants';
import { useActivities, useUserAssets } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Activity, Asset } from 'lib/types';
import { getTableAssets } from 'lib/utils/asset.utils';
import { replaceArrayAtIndex } from 'lib/utils/conversion.utils';
import { Button } from 'ui-components/Button';
import { Dialog } from 'ui-components/Dialog';
import { IconButton } from 'ui-components/IconButton';
import { AssetsList } from 'ui-components/List';
import { MoveFolderBreadcrumbs } from './Breadcrumbs.component';

export const Move = () => {
	const queryClient = useQueryClient();
	const [moveFolderDialogOpen, setMoveFolderDialogOpen] = useState(false);
	// State of the selected folder for the items to move
	const [selectedFolderAssetId, setSelectedFolderAssetId] = useState<number>(0);
	// State for showing children of the selected folder
	const [parentAssetId, setParentAssetId] = useState<number>(0);

	const { data: assets, getChildAssets, getParentId, getRootParent } = useUserAssets();
	const [{ selectedAssets }, setTableState] = useRecoilState(tableStateAtom);

	const { addActivity, updateActivity } = useActivities();
	const { mutateAsync: moveAssetMutate } = useMutation({
		mutationFn: api.Assets.moveAssets,
		onSuccess: movedAssets => {
			queryClient.setQueriesData<Asset[]>([QUERY_USER_ASSETS], old => {
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
		return selectedAssets.filter(asset => {
			const parentId = getParentId(asset.id);

			// If the asset is already in home
			if (selectedFolderAssetId === parentId) {
				return false;
			}

			// Moving asset to home
			if (selectedFolderAssetId === 0) {
				return true;
			}

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
	}, [moveFolderDialogOpen, selectedFolderAssetId]);

	const handleOnMoveFolder = () => {
		setMoveFolderDialogOpen(selectedAssets.length > 0);
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

		// Add move activities for each asset to be moved
		const moveTo = assets.find(asset => asset.id === selectedFolderAssetId);
		const activityIds = assetsToMove.map(asset => {
			return addActivity({
				inProgress: true,
				isFinished: false,
				name: asset.name,
				newFolder: moveTo?.name ?? 'Home',
				type: 'move',
				onUndo: activity => handleOnUndo(asset, activity)
			});
		});

		try {
			await moveAssetMutate(
				assetsToMove.map(asset => ({
					id: asset.id,
					parent_id: [selectedFolderAssetId]
				}))
			);

			// Mark move activities as finished
			activityIds.forEach(activityId => updateActivity(activityId, { isFinished: true, inProgress: false }));

			// Reset selected rows
			setTableState(prevState => ({
				...prevState,
				selectedAssets: []
			}));
		} catch (error) {
			// Mark move activities as error
			activityIds.forEach(activityId =>
				updateActivity(activityId, { inProgress: false, error: (error as Error).message })
			);
		}
	};

	const handleOnUndo = async (asset: Asset, previousActivity: Activity) => {
		if (!assets?.length) {
			return;
		}

		// Reset the previous activity's onUndo button
		updateActivity(previousActivity.id, { onUndo: undefined });

		// Add onUndo activity
		const moveTo = assets.find(({ id }) => id === asset.parentId);
		const undoActivityId = addActivity({
			inProgress: true,
			isFinished: false,
			name: previousActivity.name,
			newFolder: moveTo?.name ?? 'Home',
			type: 'move',
			isUndo: true
		});

		// Apply `undo` asset
		await moveAssetMutate([
			{
				id: asset.id,
				parent_id: asset.parentId ? [asset.parentId] : []
			}
		]);

		// Mark the onUndo activity as finished
		updateActivity(undoActivityId, { isFinished: true, inProgress: false });
	};

	return (
		<>
			{selectedAssets.length ? (
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
						onConfirmDisabled={!assetsToMove.length}
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
								// Show button only if there are nested assets with the type folder
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
		</>
	);
};
