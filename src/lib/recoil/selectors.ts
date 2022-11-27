import { selector } from 'recoil';

import { Asset } from 'lib/types/Asset.types';

interface AssetSelector {
	getChildAssets: (assetId: number) => Asset[];
	getParentAsset: (assetId: number) => Asset | null;
	getParentId: (asset: Asset) => number | null;
	getRootParent: (assetId: number) => Asset | null;
}

export const assetsSelector = selector<AssetSelector>({
	key: 'assetsSelector',
	get: () => {
		const getChildAssets = (assetId: number) => {
			return [];
		};

		const getParentAsset = (assetId: number) => {
			return null;
		};

		const getParentId = (asset: Asset) => {
			return null;
		};

		const getRootParent = (assetId: number) => {
			return null;
		};

		return {
			/**
			 * Get the child assets of an assetId
			 */
			getChildAssets,
			/**
			 * Get the parent asset of an assetId
			 */
			getParentAsset,
			/**
			 * Get the parentId of an asset
			 */
			getParentId,
			/**
			 * Get the root parent of an asset
			 */
			getRootParent
		};
	}
});
