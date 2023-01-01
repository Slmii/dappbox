import { useRecoilState } from 'recoil';

import { activitiesAtom } from 'lib/recoil';
import { Activity } from 'lib/types';

export const useActivities = () => {
	const [activities, setActivities] = useRecoilState(activitiesAtom);

	const addActivity = (activity: Omit<Activity, 'id'>) => {
		let activityId = 0;

		setActivities(({ id, activities }) => {
			activityId = id + 1;
			return { open: true, id: activityId, activities: [{ ...activity, id: activityId }, ...activities] };
		});

		return activityId;
	};

	const removeActivity = (activityId: number) => {
		setActivities(({ activities, id }) => {
			const newActivities = activities.filter(activity => activity.id !== activityId);

			return {
				id,
				open: !!newActivities.length,
				activities: activities.filter(activity => activity.id !== activityId)
			};
		});
	};

	const removeAllActivities = () => {
		setActivities(({ activities, id }) => {
			const newActivities = activities.filter(activity => {
				if (activity.isFinished) {
					return false;
				}

				if (activity.error) {
					return false;
				}

				return true;
			});

			return {
				id,
				open: !!newActivities.length,
				activities: newActivities
			};
		});
	};

	const updateActivity = (
		activityId: number,
		data: Partial<Activity> | ((activity: Activity) => Partial<Activity>)
	) => {
		setActivities(({ open, id, activities }) => {
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
				open,
				id,
				activities: newActivities
			};
		});
	};

	return {
		open: activities.open,
		setOpen: (open: boolean) => setActivities(activities => ({ ...activities, open })),
		activities,
		addActivity,
		updateActivity,
		removeActivity,
		removeAllActivities
	};
};
