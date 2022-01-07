import { selector } from 'recoil';

import { assetsState } from './atoms';

/**
 * State for showing folders onluy
 */
export const assetFoldersState = selector({
	key: 'assetFoldersState',
	get: ({ get }) => {
		const assets = get(assetsState);

		// TODO: nested folders
		return assets.filter(asset => asset.assetType === 'folder');
	}
});

/**
 * State for showing favorites
 */
export const favoriteAssetsState = selector({
	key: 'favoriteAssetsState',
	get: ({ get }) => {
		const assets = get(assetsState);
		return assets.filter(asset => asset.isFavorite);
	}
});
