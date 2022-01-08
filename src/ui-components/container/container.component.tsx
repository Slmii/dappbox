import Box from '@mui/material/Box';

import { constants } from 'lib/constants';

export const FilesContainer: React.FC = ({ children }) => {
	return (
		<Box
			sx={{
				flexGrow: 1,
				height: 'calc(100vh - 220px)'
			}}
		>
			{children}
		</Box>
	);
};

export const Content: React.FC = ({ children }) => {
	return (
		<Box
			sx={{
				padding: 1
			}}
		>
			{children}
		</Box>
	);
};

export const Main: React.FC = ({ children }) => {
	return (
		<Box
			component='main'
			sx={{
				marginLeft: `${constants.DRAWER_WIDTH}px`
			}}
		>
			{children}
		</Box>
	);
};
