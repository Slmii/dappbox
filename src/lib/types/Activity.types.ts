export type ActivityType = 'file' | 'download' | 'delete' | 'move' | 'folder';

export interface Activity {
	id: number;
	name: string;
	type: ActivityType;
	inProgress: boolean;
	isFinished: boolean;
	onUndo?: () => void | Promise<void>;
	href?: string;
}

export interface FileWithActivity {
	file: File;
	activityId: number;
}
