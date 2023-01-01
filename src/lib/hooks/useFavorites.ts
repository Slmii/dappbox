import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from 'api';
import { constants } from 'lib/constants';
import { Activity, Asset } from 'lib/types';
import { replaceArrayAtIndex } from 'lib/utils';
import { useActivities } from './useActivities';
import { useUserAssets } from './useUserAssets';

export const useFavorites = () => {
	const queryClient = useQueryClient();

	const { addActivity, updateActivity } = useActivities();
	const { data: assets } = useUserAssets();

	const {
		mutateAsync: editAssetMutate,
		isLoading,
		isSuccess,
		reset
	} = useMutation({
		mutationFn: api.Assets.editAsset,
		onSuccess: asset => {
			queryClient.setQueriesData<Asset[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				// Find the index of the removed asset in the current cache
				const index = old.findIndex(oldAsset => oldAsset.id === asset.id);
				if (index === -1) {
					return old;
				}

				// Replace the renamed asset in the currence cache
				const updatedAssets = replaceArrayAtIndex(old, index, asset);

				return updatedAssets;
			});
		}
	});

	const handleOnFavoritesToggle = async (assetId: number) => {
		if (!assets) {
			return;
		}

		const asset = assets.find(asset => asset.id === assetId);
		if (!asset) {
			return;
		}

		// Add activity for favorite
		const activityId = addActivity({
			inProgress: true,
			isFinished: false,
			name: asset.name,
			type: asset.isFavorite ? 'favorite-remove' : 'favorite-add',
			onUndo: activity => handleOnUndo(asset, activity)
		});

		await editAssetMutate({
			id: asset.id,
			extension: asset.type === 'file' && asset.extension ? [asset.extension] : [],
			is_favorite: asset.isFavorite ? [false] : [true],
			name: [asset.name],
			parent_id: asset.parentId ? [asset.parentId] : []
		});

		// Update activity for favorite
		updateActivity(activityId, { inProgress: false, isFinished: true });
	};

	const handleOnUndo = async (asset: Asset, previousActivity: Activity) => {
		// Reset the previous activity's onUndo button
		updateActivity(previousActivity.id, { onUndo: undefined });

		// Add onUndo activity
		const undoActivityId = addActivity({
			inProgress: true,
			isFinished: false,
			name: asset.name,
			// Reverse because this is an undo
			type: asset.isFavorite ? 'favorite-add' : 'favorite-remove'
		});

		await editAssetMutate({
			id: asset.id,
			extension: asset.type === 'file' && asset.extension ? [asset.extension] : [],
			// Reverse because this is an undo
			is_favorite: asset.isFavorite ? [true] : [false],
			name: [asset.name],
			parent_id: asset.parentId ? [asset.parentId] : []
		});

		// Mark the onUndo activity as finished
		updateActivity(undoActivityId, { isFinished: true, inProgress: false });
	};

	return {
		handleOnFavoritesToggle,
		isLoading,
		isSuccess,
		reset
	};
};
