import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';

export const Caption = ({ title }: { title: string }) => {
	return (
		<Typography color='inherit' variant='caption'>
			{title}
		</Typography>
	);
};

export const PageTitle = ({ children, gutter }: PropsWithChildren<{ gutter?: boolean }>) => {
	return (
		<Typography color='inherit' variant='h4' fontWeight='bold' gutterBottom={gutter}>
			{children}
		</Typography>
	);
};

export const SubTitle = ({ children, gutter }: PropsWithChildren<{ gutter?: boolean }>) => {
	return (
		<Typography color='inherit' variant='subtitle2' gutterBottom={gutter}>
			{children}
		</Typography>
	);
};

export const Paragraph = ({ children, gutter }: PropsWithChildren<{ gutter?: boolean }>) => {
	return (
		<Typography variant='body2' gutterBottom={gutter}>
			{children}
		</Typography>
	);
};
