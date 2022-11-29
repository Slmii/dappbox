import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { constants } from 'lib/constants';
import { replaceAsset } from 'lib/functions';
import { useUserAssets } from './useUserAssets';

export const useFavorites = () => {
	const queryClient = useQueryClient();
	const { data: assets } = useUserAssets();
	const [onUndoAssetId, setOnUndoAssetId] = useState<number | null>(null);

	const handleOnFavoritesToggle = (assetId: number) => {
		if (!assets) {
			return;
		}

		const index = assets.findIndex(asset => asset.id === assetId);

		if (index !== -1) {
			const asset = assets[index];

			// Keep track of the assetId in case
			// the user is making use of the `Undo` button
			setOnUndoAssetId(asset.id);

			// TODO: mutate canister
			// TODO: update cache in react query or invalidate query after udpdate
			// TODO: move to useMutation call
			queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], () => {
				return replaceAsset({
					assets,
					index,
					value: { ...asset, isFavorite: !asset.isFavorite }
				});
			});
		}
	};

	const handleOnUndo = () => {
		if (onUndoAssetId) {
			handleOnFavoritesToggle(onUndoAssetId);

			// Remove asset from state after pressing `Undo`
			setOnUndoAssetId(null);
		}
	};

	return {
		handleOnFavoritesToggle,
		handleOnUndo
	};
};
