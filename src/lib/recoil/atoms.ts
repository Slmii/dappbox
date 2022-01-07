import { atom } from 'recoil';

import { Asset } from 'lib/generated/dappbox_types';
import { Order } from 'ui-components/table';

export interface TableAssetsState {
	rows: Asset[];
	selectedRows: string[];
	order: Order;
	orderBy: keyof Asset;
	setSelectedRows: (rows: string[]) => void;
	setOrder: (order: Order) => void;
	setOrderBy: (orderBy: keyof Asset) => void;
}

/**
 * State for all assets
 */
export const assetsState = atom<Asset[]>({
	key: 'assetsState',
	default: []
});

/**
 * State for showing assets in table (nested folders/files)
 */
export const tableAssetsState = atom<TableAssetsState>({
	key: 'tableAssetsState',
	default: {
		rows: [],
		selectedRows: [],
		order: 'asc',
		orderBy: 'name',
		setSelectedRows: () => {},
		setOrder: () => {},
		setOrderBy: () => {}
	}
});
