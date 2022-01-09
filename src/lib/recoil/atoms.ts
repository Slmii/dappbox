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
 * Atom for all assets
 */
export const assetsAtom = atom<AssetsState>({
	key: 'assetsAtom',
	default: {
		assets: [],
		isLoading: false
	}
});

/**
 * Atom for current table state (order, orderBy and selectedRows)
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
 * Atom for showing assets that are a child of the current assetId
 * in the URL param
 */
export const tableAssetsAtom = atom<Asset[]>({
	key: 'tableAssetsAtom',
	default: []
});
