import Box from '@mui/material/Box';

import { constants } from 'lib/constants';

export const Container: React.FC = ({ children }) => {
	return (
		<Box
			component='main'
			sx={{
				flexGrow: 1,
				padding: 2,
				marginLeft: `${constants.DRAWER_WIDTH}px`,
				height: 'calc(100vh - 65px)',
				'& > *:not(:last-child)': {
					marginBottom: 1
				}
			}}
		>
			{children}
		</Box>
	);
};
