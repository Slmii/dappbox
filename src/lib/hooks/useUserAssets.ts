import { Principal } from '@dfinity/principal';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { api } from 'api';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { Asset } from 'lib/types/Asset.types';

export const dummyRows: Asset[] = [
	{
		id: 3,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: undefined,
		type: 'file',
		name: 'Test file A',
		extension: 'txt',
		mimeType: 'txt',
		size: 5,
		isFavorite: false,
		createdAt: new Date(),
		chunks: []
	},
	{
		id: 6,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: 4,
		type: 'file',
		name: 'Test file B-1-B',
		extension: 'png',
		mimeType: 'png',
		size: 200,
		isFavorite: true,
		createdAt: new Date(),
		chunks: []
	},
	{
		id: 1,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: undefined,
		type: 'folder',
		name: 'Test folder A',
		extension: undefined,
		mimeType: undefined,
		size: undefined,
		isFavorite: false,
		createdAt: new Date(),
		chunks: []
	},
	{
		id: 2,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: undefined,
		type: 'folder',
		name: 'Test folder B',
		extension: undefined,
		mimeType: undefined,
		size: undefined,
		isFavorite: true,
		createdAt: new Date(),
		chunks: []
	},
	{
		id: 4,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: 2,
		type: 'folder',
		name: 'Test folder B-1',
		extension: undefined,
		mimeType: undefined,
		size: undefined,
		isFavorite: false,
		createdAt: new Date(),
		chunks: []
	},
	{
		id: 7,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: undefined,
		type: 'file',
		name: 'Test file B',
		extension: 'pdf',
		mimeType: 'pdf',
		size: 557,
		isFavorite: false,
		createdAt: new Date(),
		chunks: []
	},
	{
		id: 8,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: 2,
		type: 'file',
		name: 'Test file C',
		extension: 'pdf',
		mimeType: 'pdf',
		size: 557,
		isFavorite: false,
		createdAt: new Date(),
		chunks: []
	},
	{
		id: 5,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: 4,
		type: 'folder',
		name: 'Test folder B-1-A',
		extension: undefined,
		mimeType: undefined,
		size: undefined,
		isFavorite: true,
		createdAt: new Date(),
		chunks: []
	}
];

export const useUserAssets = () => {
	const { isAuthenticated } = useContext(AuthContext);

	const data = useQuery([constants.QUERY_KEYS.USER_ASSETS], {
		queryFn: api.Asset.getUserAssets,
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

		return undefined;
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
