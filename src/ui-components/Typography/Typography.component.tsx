import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';

export const Caption = ({ title }: { title: string }) => {
	return (
		<Typography color='inherit' variant='caption'>
			{title}
		</Typography>
	);
};

export const PageTitle = ({ title, gutterBottom }: { title: string; gutterBottom?: boolean }) => {
	return (
		<Typography color='inherit' variant='h4' fontWeight='bold' gutterBottom={gutterBottom}>
			{title}
		</Typography>
	);
};

export const Body = ({ children, gutterBottom }: PropsWithChildren<{ gutterBottom?: boolean }>) => {
	return (
		<Typography variant='body2' gutterBottom={gutterBottom}>
			{children}
		</Typography>
	);
};
