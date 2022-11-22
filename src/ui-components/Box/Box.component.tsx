import MuiBox, { BoxProps } from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { PropsWithChildren } from 'react';

import { constants } from 'lib/constants';

export const Box = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
	return <MuiBox {...props}>{children}</MuiBox>;
};

export const RowBox = ({ children }: PropsWithChildren) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				'& > *:not(:last-child)': {
					marginBottom: constants.SPACING
				}
			}}
		>
			{children}
		</Box>
	);
};

export const assetBoxStyles: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	'&: hover': {
		backgroundColor: 'action.hover',
		cursor: 'pointer'
	},
	padding: '6px 16px',
	minHeight: 56.5,
	borderBottom: 1,
	borderColor: 'divider'
};
