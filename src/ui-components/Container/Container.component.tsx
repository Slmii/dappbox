import Box from '@mui/material/Box';
import { PropsWithChildren } from 'react';

import { constants } from 'lib/constants';

export const FilesContainer = ({ children }: PropsWithChildren) => {
	return (
		<Box
			sx={{
				flexGrow: 1,
				height: 'calc(100vh - 235px)'
			}}
		>
			{children}
		</Box>
	);
};

export const Content = ({ children }: PropsWithChildren) => {
	return (
		<Box
			sx={{
				padding: constants.SPACING
			}}
		>
			{children}
		</Box>
	);
};

export const Main = ({ children }: PropsWithChildren) => {
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
