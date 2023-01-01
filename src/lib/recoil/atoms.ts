import { atom, selectorFamily } from 'recoil';

import { Activity, TableState } from 'lib/types';

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
export const activitiesAtom = atom<{ open: boolean; id: number; activities: Activity[] }>({
	key: 'activitiesAtom',
	default: {
		open: false,
		// Keep track of the activity increment ID
		id: 0,
		activities: []
	}
});

/**
 * Get a single activity
 */
export const activityAtom = selectorFamily({
	key: 'activityAtom',
	get:
		(activityId: number) =>
		({ get }) =>
			get(activitiesAtom).activities.find(activity => activity.id === activityId)
});
