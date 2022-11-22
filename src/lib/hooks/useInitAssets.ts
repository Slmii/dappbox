import { Principal } from '@dfinity/principal';
import { useContext, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { Asset } from 'declarations/dappbox/dappbox.did';
import { AuthContext } from 'lib/context';
import { assetsAtom } from 'lib/recoil';

export const dummyRows: Asset[] = [
	{
		assetId: 3,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: [],
		assetType: 'file',
		name: 'Test file A',
		extension: ['txt'],
		mimeType: ['txt'],
		size: [5],
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
		size: [200],
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
		size: [557],
		isFavorite: false,
		createdAt: BigInt(new Date().getTime())
	},
	{
		assetId: 8,
		userId: Principal.fromText('2vxsx-fae'),
		parentId: [2],
		assetType: 'file',
		name: 'Test file C',
		extension: ['pdf'],
		mimeType: ['pdf'],
		size: [557],
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
	const { isAuthenticated } = useContext(AuthContext);
	const setAssets = useSetRecoilState(assetsAtom);

	useEffect(() => {
		const init = async () => {
			if (!isAuthenticated) {
				return;
			}

			setAssets({
				isLoading: true,
				assets: []
			});

			// TODO: fetch from canister and remove `sleep`
			await sleep(2000);

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

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
