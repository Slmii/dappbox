import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';

export const TableLoader = () => {
	const render = () => {
		const jsx: JSX.Element[] = [];

		for (let i = 0; i < 10; i++) {
			jsx.push(
				<TableCell
					component='div'
					size='small'
					sx={{
						padding: 0,
						height: 57
					}}
				>
					<Skeleton
						variant='text'
						animation='wave'
						height='inherit'
						sx={{
							transform: 'unset',
							borderRadius: 0
						}}
					/>
				</TableCell>
			);
		}

		return <Stack spacing={0}>{jsx}</Stack>;
	};

	return <>{render()}</>;
};
