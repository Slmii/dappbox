import { Asset } from './generated/dappbox_types';

/**
 * Get the page title of the current asset
 */
export const getPageTitle = (pathname: string, rows: Asset[]) => {
	const param = pathname.split('/').pop();

	if (!param) {
		return '';
	}

	const pageTitle = rows.find(row => row.assetId === Number(param))?.name ?? '';
	return decodeURIComponent(pageTitle);
};

/**
 * Get the full path to the current asset (including parent assets), in the correct order
 */
export const getPathToAsset = (assetId: number, assets: Asset[]) => {
	const paths: Asset[] = [];

	const asset = assets.find(row => row.assetId === assetId);
	if (asset) {
		// Put at the front of the array for the correct order
		paths.unshift(asset);

		if (asset?.parentId[0]) {
			// Put at the front of the array for the correct order
			paths.unshift(...getPathToAsset(asset.parentId[0], assets));
		}
	}

	return paths;
};
