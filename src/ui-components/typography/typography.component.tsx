import Typography from '@mui/material/Typography';

export const Caption = ({ title }: { title: string }) => {
	return (
		<Typography color='inherit' variant='caption' fontWeight='bold'>
			{title}
		</Typography>
	);
};
