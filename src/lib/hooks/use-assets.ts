import { Principal } from '@dfinity/principal';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { Asset } from 'lib/generated/dappbox_types';
import { assetsState, tableAssetsState } from 'lib/recoil';
import { Order } from 'ui-components/table';

const dummyRows: Asset[] = [
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
	}
];

export const useTableAssets = () => {
	const { pathname } = useLocation();
	const [tableAssets, setTableAssets] = useRecoilState(tableAssetsState);
	const setAssets = useSetRecoilState(assetsState);

	useEffect(() => {
		setAssets(dummyRows);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const assetId = pathname.split('/').pop();
		let rows: Asset[] = [];

		if (!assetId) {
			rows = dummyRows.filter(row => !row.parentId[0]);
		} else {
			// TODO: apply sorting (desc,asc)
			rows = dummyRows.filter(row => row.parentId[0]?.toString() === decodeURIComponent(assetId));
		}

		setTableAssets(prevState => ({
			...prevState,
			selectedRows: [],
			rows
		}));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const handleOnSetSelectedRows = (rows: string[]) => {
		setTableAssets(prevState => ({
			...prevState,
			selectedRows: rows
		}));
	};

	const handleOnSetOrder = (order: Order) => {
		setTableAssets(prevState => ({
			...prevState,
			order
		}));
	};

	const handleOnSetOrderBy = (orderBy: keyof Asset) => {
		setTableAssets(prevState => ({
			...prevState,
			orderBy
		}));
	};

	return {
		...tableAssets,
		setSelectedRows: handleOnSetSelectedRows,
		setOrder: handleOnSetOrder,
		setOrderBy: handleOnSetOrderBy
	};
};
