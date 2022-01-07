import { selector, selectorFamily } from 'recoil';

import { Asset } from 'lib/generated/dappbox_types';
import { assetsState, tableState } from './atoms';

/**
 * State for showing folders only
 */
export const assetFoldersState = selector({
	key: 'assetFoldersState',
	get: ({ get }) => {
		const assets = get(assetsState);

		// TODO: nested folders
		return assets.assets.filter(asset => asset.assetType === 'folder');
	}
});

/**
 * State for showing favorites
 */
export const favoriteAssetsState = selector({
	key: 'favoriteAssetsState',
	get: ({ get }) => {
		const assets = get(assetsState);
		return assets.assets.filter(asset => asset.isFavorite);
	}
});

/**
 * State for assets in table
 */
export const tableAssetsState = selectorFamily<Asset[], string | undefined>({
	key: 'tableAssetsState',
	get:
		assetId =>
		({ get }) => {
			const { assets } = get(assetsState);
			const { order, orderBy } = get(tableState);

			const copiedAssets = [...assets];

			const folders: Asset[] = [];
			const files: Asset[] = [];

			copiedAssets
				// Return assets linked to the assetId (parent) in the URL
				// If homepage, then only return assets that do not have a parent
				.reduce((accum, asset) => {
					if (!assetId) {
						if (!asset.parentId.length) {
							accum.push(asset);
						}
					} else {
						if (asset.parentId[0]?.toString() === decodeURIComponent(assetId)) {
							accum.push(asset);
						}
					}

					return accum;
				}, [] as Asset[])
				// Sort assets
				.sort((a, b) =>
					order === 'desc' ? descendingComparator(a, b, orderBy) : -descendingComparator(a, b, orderBy)
				)
				// Seperate assets between folders and files
				.forEach(row => (row.assetType === 'folder' ? folders.push(row) : files.push(row)));

			// Return order of assets based on `asc/desc`
			// `asc` is folders first, `desc` is files first
			return order === 'asc' ? [...folders, ...files] : [...files, ...folders];
		}
});

const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}

	if (b[orderBy] > a[orderBy]) {
		return 1;
	}

	return 0;
};
