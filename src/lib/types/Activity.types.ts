export type ActivityType = 'upload' | 'download' | 'delete' | 'move' | 'folder';

export interface Activity {
	id: number;
	name: string;
	type: ActivityType;
	inProgress: boolean;
	progress?: number;
	onUndo?: () => void | Promise<void>;
	href?: string;
}
