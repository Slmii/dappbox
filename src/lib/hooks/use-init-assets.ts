import { Principal } from '@dfinity/principal';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { Asset } from 'lib/generated/dappbox_types';
import { assetsState, tableState as tableStateAtom } from 'lib/recoil';

const dummyRows: Asset[] = [
	{
		assetId: 3,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: [],
		assetType: 'file',
		name: 'Test file A',
		extension: ['txt'],
		mimeType: ['txt'],
		size: [BigInt(5)],
		isFavorite: false,
		createdAt: BigInt(new Date().getTime())
	},

	{
		assetId: 6,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: [4],
		assetType: 'file',
		name: 'Test file B-1-B',
		extension: ['png'],
		mimeType: ['png'],
		size: [BigInt(200)],
		isFavorite: true,
		createdAt: BigInt(new Date().getTime())
	},
	{
		assetId: 1,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: [],
		assetType: 'folder',
		name: 'Test folder A',
		extension: [],
		mimeType: [],
		size: [],
		isFavorite: false,
		createdAt: BigInt(new Date().getTime())
	},
	{
		assetId: 2,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: [],
		assetType: 'folder',
		name: 'Test folder B',
		extension: [],
		mimeType: [],
		size: [],
		isFavorite: true,
		createdAt: BigInt(new Date().getTime())
	},
	{
		assetId: 4,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: [2],
		assetType: 'folder',
		name: 'Test folder B-1',
		extension: [],
		mimeType: [],
		size: [],
		isFavorite: false,
		createdAt: BigInt(new Date().getTime())
	},
	{
		assetId: 7,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: [],
		assetType: 'file',
		name: 'Test file B',
		extension: ['pdf'],
		mimeType: ['pdf'],
		size: [BigInt(557)],
		isFavorite: false,
		createdAt: BigInt(new Date().getTime())
	},
	{
		assetId: 5,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: [4],
		assetType: 'folder',
		name: 'Test folder B-1-A',
		extension: [],
		mimeType: [],
		size: [],
		isFavorite: false,
		createdAt: BigInt(new Date().getTime())
	}
];

export const useInitAssets = () => {
	const { pathname } = useLocation();
	const setTableState = useSetRecoilState(tableStateAtom);
	const setAssets = useSetRecoilState(assetsState);

	useEffect(() => {
		setAssets({
			assets: dummyRows,
			isLoading: false
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// Reset `selectedRows` in table state when redirecting
		// to another folder
		setTableState(prevState => ({
			...prevState,
			selectedRows: []
		}));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);
};
