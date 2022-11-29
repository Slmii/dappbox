import MuiBox, { BoxProps } from '@mui/material/Box';
import { PropsWithChildren } from 'react';

import { constants } from 'lib/constants';

export const Box = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
	return <MuiBox {...props}>{children}</MuiBox>;
};

export const Row = ({ children }: PropsWithChildren) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				rowGap: constants.SPACING
			}}
		>
			{children}
		</Box>
	);
};

export const Column = ({ children }: PropsWithChildren) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				columnGap: constants.SPACING
			}}
		>
			{children}
		</Box>
	);
};
