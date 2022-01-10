import { Principal } from '@dfinity/principal';
import { useContext, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { AuthContext } from 'lib/context';
import { Asset } from 'lib/generated/dappbox_types';
import { assetsAtom } from 'lib/recoil';

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
	const { isAuthenticated, initUser } = useContext(AuthContext);
	const setAssets = useSetRecoilState(assetsAtom);

	useEffect(() => {
		// Init user when authenticated and on the home page. We do not use
		// this in the `AuthContext` because that would require a longer load
		// time before being redirect to the home page
		initUser();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// TODO: try and catch and show dialog with error
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
};
