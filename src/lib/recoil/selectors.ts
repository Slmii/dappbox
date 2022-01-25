import { selector } from 'recoil';

import { Asset } from 'lib/generated/dappbox_types';
import { assetsAtom } from './atoms';

interface AssetSelector {
	getChildAssets: (assetId: number) => Asset[];
	getParentAsset: (assetId: number) => Asset | null;
	getParentId: (asset: Asset) => number | null;
	getRootParent: (assetId: number) => Asset | null;
}

export const assetsSelector = selector<AssetSelector>({
	key: 'assetsSelector',
	get: ({ get }) => {
		const { assets } = get(assetsAtom);

		const getChildAssets = (assetId: number) => {
			return assets.filter(asset => typeof asset.parentId[0] !== 'undefined' && asset.parentId[0] === assetId);
		};

		const getParentAsset = (assetId: number) => {
			return assets.find(asset => asset.assetId === assetId) ?? null;
		};

		const getParentId = (asset: Asset) => {
			if (typeof asset.parentId[0] !== 'undefined') {
				return asset.parentId[0];
			}

			return null;
		};

		const getRootParent = (assetId: number): Asset | null => {
			const asset = assets.find(asset => asset.assetId === assetId);

			if (typeof asset?.parentId[0] !== 'undefined') {
				return getRootParent(asset.parentId[0]);
			}

			return asset ?? null;
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
