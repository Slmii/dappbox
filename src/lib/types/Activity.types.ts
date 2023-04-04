export type ActivityType =
	| 'file'
	| 'download'
	| 'delete'
	| 'move'
	| 'folder'
	| 'rename'
	| 'favorite-add'
	| 'favorite-remove';

export interface Activity {
	id: number;
	name: string;
	type: ActivityType;
	inProgress: boolean;
	isFinished: boolean;
	/**
	 * The total number of chunks that will be uploaded
	 */
	totalChunks?: number;
	/**
	 * The current chunk that is being uploaded
	 */
	currentChunk?: number;
	/**
	 * Used for renaming asset. The old name will be shown as strike-through
	 */
	oldName?: string;
	/**
	 * Used for moving asset. The new folder will be shown where the asset is being
	 * moved to
	 */
	newFolder?: string;
	isUndo?: boolean;
	/**
	 * The created activity's ID as an argument in the callback
	 */
	onUndo?: (activity: Activity) => void | Promise<void>;
	/**
	 * Redirect to a URL
	 */
	href?: string;
	error?: string;
}

export interface FileWithActivity {
	file: File;
	activityId: number;
}
