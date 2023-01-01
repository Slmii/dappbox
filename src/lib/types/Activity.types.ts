export type ActivityType = 'file' | 'download' | 'delete' | 'move' | 'folder' | 'rename';

export interface Activity {
	id: number;
	name: string;
	oldName?: string;
	type: ActivityType;
	inProgress: boolean;
	isFinished: boolean;
	/**
	 * The created activity's ID as an argument in the callback
	 */
	onUndo?: (activity: Activity) => void | Promise<void>;
	/**
	 * Redirect to a URL
	 */
	href?: string;
}

export interface FileWithActivity {
	file: File;
	activityId: number;
}
