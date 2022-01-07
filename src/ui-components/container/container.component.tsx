import Box from '@mui/material/Box';

import { constants } from 'lib/constants';

export const FilesContainer: React.FC = ({ children }) => {
	return (
		<Box
			sx={{
				flexGrow: 1,
				paddingX: 2,
				paddingY: 1,
				height: 'calc(100vh - 200px)'
			}}
		>
			{children}
		</Box>
	);
};

export const TopContainer: React.FC = ({ children }) => {
	return (
		<Box
			sx={{
				paddingX: 2,
				paddingY: 1
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
