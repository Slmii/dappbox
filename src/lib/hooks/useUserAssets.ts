import { Principal } from '@dfinity/principal';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { Asset } from 'lib/types/Asset.types';

export const dummyRows: Asset[] = [
	{
		assetId: 3,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: undefined,
		assetType: 'file',
		name: 'Test file A',
		extension: 'txt',
		mimeType: 'txt',
		size: 5,
		isFavorite: false,
		createdAt: new Date()
	},
	{
		assetId: 6,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: 4,
		assetType: 'file',
		name: 'Test file B-1-B',
		extension: 'png',
		mimeType: 'png',
		size: 200,
		isFavorite: true,
		createdAt: new Date()
	},
	{
		assetId: 1,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: undefined,
		assetType: 'folder',
		name: 'Test folder A',
		extension: undefined,
		mimeType: undefined,
		size: undefined,
		isFavorite: false,
		createdAt: new Date()
	},
	{
		assetId: 2,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: undefined,
		assetType: 'folder',
		name: 'Test folder B',
		extension: undefined,
		mimeType: undefined,
		size: undefined,
		isFavorite: true,
		createdAt: new Date()
	},
	{
		assetId: 4,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: 2,
		assetType: 'folder',
		name: 'Test folder B-1',
		extension: undefined,
		mimeType: undefined,
		size: undefined,
		isFavorite: false,
		createdAt: new Date()
	},
	{
		assetId: 7,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: undefined,
		assetType: 'file',
		name: 'Test file B',
		extension: 'pdf',
		mimeType: 'pdf',
		size: 557,
		isFavorite: false,
		createdAt: new Date()
	},
	{
		assetId: 8,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: 2,
		assetType: 'file',
		name: 'Test file C',
		extension: 'pdf',
		mimeType: 'pdf',
		size: 557,
		isFavorite: false,
		createdAt: new Date()
	},
	{
		assetId: 5,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: 4,
		assetType: 'folder',
		name: 'Test folder B-1-A',
		extension: undefined,
		mimeType: undefined,
		size: undefined,
		isFavorite: true,
		createdAt: new Date()
	}
];

export const useUserAssets = () => {
	const { isAuthenticated } = useContext(AuthContext);

	return useQuery([constants.QUERY_KEYS.USER_ASSETS], {
		queryFn: () => Promise.resolve(dummyRows),
		enabled: isAuthenticated
	});
};
