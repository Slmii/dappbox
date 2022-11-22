import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { replaceAsset } from 'lib/functions';
import { assetsAtom } from 'lib/recoil';

export const useFavorites = () => {
	const [onUndoAssetId, setOnUndoAssetId] = useState<number | null>(null);
	const [{ assets }, setAssets] = useRecoilState(assetsAtom);

	const handleOnFavoritesToggle = (assetId: number) => {
		const index = assets.findIndex(asset => asset.assetId === assetId);

		if (index !== -1) {
			const asset = assets[index];

			// Keep track of the assetId in case
			// the user is making use of the `Undo` button
			setOnUndoAssetId(asset.assetId);

			setAssets(prevState => ({
				...prevState,
				assets: replaceAsset({
					assets,
					index,
					value: { ...asset, isFavorite: !asset.isFavorite }
				})
			}));
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
