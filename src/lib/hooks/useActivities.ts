import { useRecoilState } from 'recoil';

import { activitiesAtom } from 'lib/recoil';
import { Activity } from 'lib/types';

export const useActivities = () => {
	const [activities, setActivities] = useRecoilState(activitiesAtom);

	const addActivity = (activity: Omit<Activity, 'id'>) => {
		let activityId = 0;

		setActivities(({ id, activities }) => {
			activityId = id + 1;
			return { id: activityId, activities: [{ ...activity, id: activityId }, ...activities] };
		});

		return activityId;
	};

	const removeActivity = (activityId: number) => {
		setActivities(({ id, activities }) => ({
			id,
			activities: activities.filter(activity => activity.id !== activityId)
		}));
	};

	const updateActivity = (
		activityId: number,
		data: Partial<Activity> | ((activity: Activity) => Partial<Activity>)
	) => {
		setActivities(({ id, activities }) => {
			const newActivities = activities.map(activity => {
				if (activity.id === activityId) {
					return {
						...activity,
						...(typeof data === 'function' ? data(activity) : data)
					};
				}

				return activity;
			});

			return {
				id,
				activities: newActivities
			};
		});
	};

	return {
		activities,
		addActivity,
		updateActivity,
		removeActivity
	};
};
