export const constants = {
	DRAWER_WIDTH: 240,
	SPACING: 1,
	QUERY_KEYS: {
		USER_ASSETS: 'USER_ASSETS'
	},
	ENVIRONMENT: process.env.REACT_APP_ENV ?? 'local',
	IS_LOCAL: process.env.REACT_APP_ENV === 'local'
};
