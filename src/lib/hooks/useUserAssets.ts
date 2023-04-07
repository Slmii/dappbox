import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { api } from 'api';
import { QUERY_USER_ASSETS } from 'lib/constants/query-keys.constants';
import { AuthContext } from 'lib/context';
import { Asset } from 'lib/types';

export const useUserAssets = () => {
	const { isAuthenticated } = useContext(AuthContext);

	const data = useQuery([QUERY_USER_ASSETS], {
		queryFn: api.Assets.getUserAssets,
		enabled: isAuthenticated
	});

	const getChildAssets = (assetId: number) => {
		if (!data.data) {
			return [];
		}

		return data.data.filter(asset => typeof asset.parentId !== 'undefined' && asset.parentId === assetId);
	};

	const getNestedChildAssets = (assetId: number): Asset[] => {
		const childAssets = getChildAssets(assetId);

		const assets: Asset[] = [];

		for (const childAsset of childAssets) {
			if (childAsset.type === 'folder') {
				assets.push(...getNestedChildAssets(childAsset.id));
			}

			assets.push(childAsset);
		}

		return assets;
	};

	const getParentAsset = (assetId: number) => {
		return data.data?.find(asset => asset.id === assetId);
	};

	const getParentId = (assetId: number) => {
		const asset = data.data?.find(asset => asset.id === assetId);

		if (asset?.parentId) {
			return asset.parentId;
		}

		return 0;
	};

	const getRootParent = (assetId: number): Asset | undefined => {
		const asset = data.data?.find(asset => asset.id === assetId);

		if (asset?.parentId) {
			return getRootParent(asset.parentId);
		}

		return asset;
	};

	return {
		...data,
		getChildAssets,
		getNestedChildAssets,
		getParentAsset,
		getRootParent,
		getParentId
	};
};

// export const useUserAsset = (assetId: number) =>
// 	useUserAssets<Asset | undefined>(assets => assets.find(asset => asset.id === assetId));

// 	export const useChildAssets = (assetId: number) =>
// 	useUserAssets<Asset[]>(assets => assets.filter(asset => asset.parentId === assetId));

// export const useParentAsset = (assetId: number) =>
// 	useUserAssets<Asset | undefined>(assets => assets.find(asset => asset.id === assetId));

// export const useRootParent = (assetId: number) =>
// 	useUserAssets<Asset | undefined>(assets => {
// 		const getRootParent = (assetId: number): Asset | undefined => {
// 			const asset = assets.find(asset => asset.id === assetId);

// 			if (asset?.parentId) {
// 				return getRootParent(asset.parentId);
// 			}

// 			return asset;
// 		};

// 		return getRootParent(assetId);
// 	});
