import { atom } from 'recoil';

import { Asset } from 'lib/types/Asset.types';
import { Order } from 'ui-components/Table';

export interface TableState {
	selectedRows: Asset[];
	order: Order;
	orderBy: keyof Asset;
}

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
