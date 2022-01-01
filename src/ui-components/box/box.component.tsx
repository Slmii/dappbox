import MuiBox, { BoxProps } from '@mui/material/Box';

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
					marginBottom: 2
				}
			}}
		>
			{children}
		</Box>
	);
};
