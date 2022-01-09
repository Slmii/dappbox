import { atom } from 'recoil';

import { Asset } from 'lib/generated/dappbox_types';
import { Order } from 'ui-components/table';

export interface TableState {
	selectedRows: number[];
	order: Order;
	orderBy: keyof Asset;
}

export interface AssetsState {
	assets: Asset[];
	isLoading: boolean;
}

/**
 * State for all assets
 */
export const assetsAtom = atom<AssetsState>({
	key: 'assetsAtom',
	default: {
		assets: [],
		isLoading: false
	}
});

/**
 * State for showing current table state
 */
export const tableStateAtom = atom<TableState>({
	key: 'tableStateAtom',
	default: {
		selectedRows: [],
		order: 'asc',
		orderBy: 'name'
	}
});

/**
 * State for showing current table assets
 */
export const tableAssetsAtom = atom<Asset[]>({
	key: 'tableAssetsAtom',
	default: []
});
