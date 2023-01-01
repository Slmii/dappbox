import Typography from '@mui/material/Typography';
import { PropsWithChildren } from 'react';

import { TypographyProps } from './Typograpgy.types';

export const Caption = ({ children, gutter, noWrap }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography color='inherit' variant='caption' gutterBottom={gutter} noWrap={noWrap}>
			{children}
		</Typography>
	);
};

export const PageTitle = ({ children, gutter, noWrap }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography color='inherit' variant='h4' fontWeight='bold' gutterBottom={gutter} noWrap={noWrap}>
			{children}
		</Typography>
	);
};

export const SubTitle = ({ children, gutter, noWrap }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography color='inherit' variant='subtitle2' gutterBottom={gutter} noWrap={noWrap}>
			{children}
		</Typography>
	);
};

export const Paragraph = ({ children, gutter, noWrap }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography variant='body2' gutterBottom={gutter} noWrap={noWrap}>
			{children}
		</Typography>
	);
};
