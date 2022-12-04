import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { api } from 'api';
import { constants } from 'lib/constants';
import { replaceArrayAtIndex } from 'lib/functions';
import { Asset } from 'lib/types/Asset.types';
import { useUserAssets } from './useUserAssets';

export const useFavorites = () => {
	const queryClient = useQueryClient();
	const [removeOrAdd, setRemoveOrAdd] = useState<'add' | 'remove'>('add');

	const { data: assets } = useUserAssets();
	const [onUndoAsset, setOnUndoAsset] = useState<Asset | null>(null);

	const {
		mutateAsync: editAssetMutate,
		isLoading,
		isSuccess,
		reset
	} = useMutation({
		mutationFn: api.Asset.editAsset,
		onSuccess: asset => {
			queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], (old: Asset[] | undefined) => {
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

		// Keep track of the assetId in case
		// the user is making use of the `Undo` button
		setOnUndoAsset(asset);
		setRemoveOrAdd(asset.isFavorite ? 'remove' : 'add');

		await editAssetMutate({
			id: asset.id,
			extension: asset.type === 'file' && asset.extension ? [asset.extension] : [],
			is_favorite: asset.isFavorite ? [false] : [true],
			name: [asset.name],
			parent_id: asset.parentId ? [asset.parentId] : []
		});
	};

	const handleOnUndo = async () => {
		if (onUndoAsset) {
			setRemoveOrAdd(onUndoAsset.isFavorite ? 'remove' : 'add');

			await handleOnFavoritesToggle(onUndoAsset.id);

			// Remove asset from state after pressing `Undo`
			setOnUndoAsset(null);
		}
	};

	return {
		handleOnFavoritesToggle,
		handleOnUndo,
		isLoading,
		isSuccess,
		reset,
		removeOrAdd
	};
};
