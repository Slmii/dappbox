import MuiBox, { BoxProps } from '@mui/material/Box';
import { PropsWithChildren } from 'react';

import { SPACING } from 'lib/constants/spacing.constants';

export const Box = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
	return <MuiBox {...props}>{children}</MuiBox>;
};

export const Row = ({ children, spacing }: PropsWithChildren<{ spacing?: number }>) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				rowGap: spacing ?? SPACING
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
				columnGap: spacing ?? SPACING
			}}
		>
			{children}
		</Box>
	);
};
