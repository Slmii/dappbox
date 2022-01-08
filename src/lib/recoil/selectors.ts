import { selector } from 'recoil';

import { assetsAtom } from './atoms';

/**
 * State for showing folders only
 */
export const assetFoldersSelector = selector({
	key: 'assetFoldersSelector',
	get: ({ get }) => {
		const { assets } = get(assetsAtom);

		// TODO: nested folders
		return assets.filter(asset => asset.assetType === 'folder');
	}
});

/**
 * State for showing favorites
 */
export const favoriteAssetsSelector = selector({
	key: 'favoriteAssetsSelector',
	get: ({ get }) => {
		const { assets } = get(assetsAtom);
		return assets.filter(asset => asset.isFavorite);
	}
});
