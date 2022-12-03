export const constants = {
	DRAWER_WIDTH: 240,
	SPACING: 1,
	CIRCULAR_PROGRESS_SIZE: 24,
	QUERY_KEYS: {
		USER_ASSETS: 'USER_ASSETS',
		CHUNKS: 'CHUNKS'
	},
	ENVIRONMENT: process.env.REACT_APP_ENV ?? 'local',
	IS_LOCAL: process.env.REACT_APP_ENV === 'local'
};
