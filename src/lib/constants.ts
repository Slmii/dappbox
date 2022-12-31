export const constants = {
	DRAWER_WIDTH: 240,
	SPACING: 1,
	CIRCULAR_PROGRESS_SIZE: 24,
	QUERY_KEYS: {
		USER_ASSETS: 'USER_ASSETS',
		CHUNKS: 'CHUNKS',
		USED_SPACE: 'USED_SPACE'
	},
	ENVIRONMENT: process.env.REACT_APP_ENV ?? 'local',
	IS_LOCAL: process.env.REACT_APP_ENV === 'local',
	MAX_UPLOAD_LIMIT: 2_097_152,
	ACTIVITIES: {
		HEIGHT_COLLAPSED: 50,
		HEIGHT: 400,
		WIDTH: 400,
		ITEM: 60
	}
};
