import { atom } from 'recoil';

import { Asset } from 'lib/types/Asset.types';
import { Order } from 'ui-components/Table';

export interface TableState {
	selectedAssets: Asset[];
	order: Order;
	orderBy: keyof Asset;
}

/**
 * Atom for current table state (order, orderBy and selectedAssets)
 */
export const tableStateAtom = atom<TableState>({
	key: 'tableStateAtom',
	default: {
		selectedAssets: [],
		order: 'asc',
		orderBy: 'name'
	}
});

/**
 * Atom for preview success/loading state
 */
export const previewStateAtom = atom<{ isLoading: boolean; isSuccess: boolean }>({
	key: 'previewStateAtom',
	default: {
		isLoading: false,
		isSuccess: false
	}
});
