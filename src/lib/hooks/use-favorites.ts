import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { assetsAtom } from 'lib/recoil';

export const useFavorites = () => {
	const [onUndoAssetId, setOnUndoAssetId] = useState<number | null>(null);
	const [{ assets }, setAssets] = useRecoilState(assetsAtom);

	const handleOnToggleFavorites = (assetId: number, state: boolean) => {
		const index = assets.findIndex(asset => asset.assetId === assetId);

		if (index !== -1) {
			const asset = assets[index];

			// Keep track of the assetId in case
			// the user is making use of the `Undo` button
			setOnUndoAssetId(asset.assetId);

			setAssets(prevState => ({
				...prevState,
				assets: [...assets.slice(0, index), { ...asset, isFavorite: state }, ...assets.slice(index + 1)]
			}));
		}
	};

	const handleOnUndo = () => {
		if (onUndoAssetId) {
			handleOnToggleFavorites(onUndoAssetId, true);

			// Remove asset from state after pressing `Undo`
			setOnUndoAssetId(null);
		}
	};

	return {
		handleOnToggleFavorites,
		handleOnUndo
	};
};
