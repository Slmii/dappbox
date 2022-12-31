import MuiBox, { BoxProps } from '@mui/material/Box';
import { PropsWithChildren } from 'react';

import { constants } from 'lib/constants';

export const Box = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
	return <MuiBox {...props}>{children}</MuiBox>;
};

export const Row = ({ children, spacing }: PropsWithChildren<{ spacing?: number }>) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				rowGap: spacing ?? constants.SPACING
			}}
		>
			{children}
		</Box>
	);
};

export const Column = ({ children, spacing }: PropsWithChildren<{ spacing?: number }>) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				columnGap: spacing ?? constants.SPACING
			}}
		>
			{children}
		</Box>
	);
};
