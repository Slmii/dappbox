import Box from '@mui/material/Box';
import { PropsWithChildren } from 'react';

import { DRAWER_WIDTH } from 'lib/constants/sizes.constants';
import { SPACING } from 'lib/constants/spacing.constants';

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

export const FavoritesContainer = ({ children }: PropsWithChildren) => {
	return (
		<Box
			sx={{
				overflowY: 'auto',
				height: 'calc(100vh - 145px)'
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
				padding: SPACING
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
				marginLeft: `${DRAWER_WIDTH}px`
			}}
		>
			{children}
		</Box>
	);
};
