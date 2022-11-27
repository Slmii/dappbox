import { atom } from 'recoil';

import { Asset } from 'lib/types/Asset.types';
import { Order } from 'ui-components/Table';

export interface TableState {
	selectedRows: Asset[];
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
