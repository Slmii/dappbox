import { atom } from 'recoil';

import { Asset } from 'lib/generated/dappbox_types';
import { Order } from 'ui-components/table';

export interface TableState {
	selectedRows: string[];
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
export const assetsState = atom<AssetsState>({
	key: 'assetsState',
	default: {
		assets: [],
		isLoading: false
	}
});

/**
 * State for showing current table state
 */
export const tableState = atom<TableState>({
	key: 'tableState',
	default: {
		selectedRows: [],
		order: 'asc',
		orderBy: 'name'
	}
});
