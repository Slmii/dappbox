import { atom } from 'recoil';

import { Activity } from 'lib/types';
import { TableState } from 'lib/types/Table.types';

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
export const previewAtom = atom<{ isLoading: boolean; isSuccess: boolean }>({
	key: 'previewStateAtom',
	default: {
		isLoading: false,
		isSuccess: false
	}
});

/**
 * Atom for activities state
 */
export const activitiesAtom = atom<Activity[]>({
	key: 'activitiesAtom',
	default: []
});
