import { Asset } from 'lib/types';

/**
 * Get the page title of the current asset
 */
export const getPageTitle = (pathname: string, assets: Asset[]) => {
	const param = pathname.split('/').pop();

	if (!param) {
		return '';
	}

	const pageTitle = assets.find(asset => asset.id === Number(param))?.name ?? '';
	return decodeURIComponent(pageTitle);
};

/**
 * Get the full URL path to the current asset (including parent assets), in the correct order
 */
export const getUrlPathToAsset = (assetId: number, assets: Asset[]) => {
	const paths: Asset[] = [];

	const asset = assets.find(asset => asset.id === assetId);
	if (asset) {
		// Put at the front of the array for the correct order
		paths.unshift(asset);

		if (typeof asset.parentId !== 'undefined') {
			// Put at the front of the array for the correct order
			paths.unshift(...getUrlPathToAsset(asset.parentId, assets));
		}
	}

	return paths;
};

/**
 * Get breadcrumbs URL
 */
export const getUrlBreadcrumbs = (assetId: number, assets: Asset[]) => {
	return getUrlPathToAsset(assetId, assets)
		.map(asset => encodeURIComponent(asset.id))
		.join('/');
};

/**
 * Get the last assetId param in the URL
 */
export const getAssetId = (pathname: string) => {
	return pathname.split('/').pop();
};
