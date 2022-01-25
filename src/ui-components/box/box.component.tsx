import MuiBox, { BoxProps } from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

export const Box: React.FC<BoxProps> = ({ children, ...props }) => {
	return <MuiBox {...props}>{children}</MuiBox>;
};

export const RowBox: React.FC = ({ children }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				'& > *:not(:last-child)': {
					marginBottom: 1
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
