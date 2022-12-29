import { useRecoilState } from 'recoil';

import { activitiesAtom } from 'lib/recoil';
import { Activity } from 'lib/types';

export const useActivities = () => {
	const [activities, setActivities] = useRecoilState(activitiesAtom);

	const addActivity = (activity: Activity) => {
		setActivities(activities => [activity, ...activities]);
	};

	const removeActivity = (activityId: number) => {
		setActivities(activities => activities.filter(activity => activity.id !== activityId));
	};

	const updateActivity = (activityId: number, data: Partial<Activity>) => {
		setActivities(activities => {
			const newActivities = activities.map(activity => {
				if (activity.id === activityId) {
					return {
						...activity,
						...data
					};
				}

				return activity;
			});

			return newActivities;
		});
	};

	return {
		activities,
		addActivity,
		updateActivity,
		removeActivity
	};
};
