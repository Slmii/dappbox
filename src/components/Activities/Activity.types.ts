import { Activity } from 'lib/types';

export interface ActivityProps {
	activity: Activity;
	onRemove: (activityId: number) => void;
	onClose?: () => void;
}
