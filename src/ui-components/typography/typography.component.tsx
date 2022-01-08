import Typography from '@mui/material/Typography';

export const Caption = ({ title }: { title: string }) => {
	return (
		<Typography color='inherit' variant='caption' fontWeight='bold'>
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

export const Body = ({ title, gutterBottom }: { title: string; gutterBottom?: boolean }) => {
	return (
		<Typography variant='body2' gutterBottom={gutterBottom}>
			{title}
		</Typography>
	);
};
