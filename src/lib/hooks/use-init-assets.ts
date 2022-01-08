import { Principal } from '@dfinity/principal';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { AuthContext } from 'lib/context';
import { getTableAssets } from 'lib/functions';
import { Asset } from 'lib/generated/dappbox_types';
import { assetsAtom, tableAssetsAtom, tableStateAtom } from 'lib/recoil';
import { getAssetId } from 'lib/url';

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
		isFavorite: true,
		createdAt: BigInt(new Date().getTime())
	}
];

export const useInitAssets = () => {
	const { pathname } = useLocation();
	const { isAuthenticated, initUser } = useContext(AuthContext);

	const [{ order, orderBy }, setTableState] = useRecoilState(tableStateAtom);
	const setTableAssets = useSetRecoilState(tableAssetsAtom);
	const setAssets = useSetRecoilState(assetsAtom);

	useEffect(() => {
		// Init user when authenticated and on the home page. We do not use
		// this in the `AuthContext` because that would require a longer load
		// time before being redirect to the home page
		initUser();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const init = async () => {
			if (!isAuthenticated) {
				return;
			}

			setAssets({
				isLoading: true,
				assets: []
			});

			// Check if user exists, if not then create one
			await initUser();

			// Set all assets in recoil state
			setAssets({
				isLoading: false,
				assets: dummyRows
			});
		};

		init();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);

	useEffect(() => {
		if (!isAuthenticated) {
			return;
		}

		setTableAssets(
			getTableAssets({
				assets: dummyRows,
				order,
				orderBy,
				assetId: getAssetId(pathname)
			})
		);

		// Reset `selectedRows` in table state when redirecting
		// to another folder
		setTableState(prevState => ({
			...prevState,
			selectedRows: []
		}));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname, isAuthenticated]);
};
