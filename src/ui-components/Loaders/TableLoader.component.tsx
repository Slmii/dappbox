import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { Box } from 'ui-components/Box';

export const TableLoader = () => {
	const render = () => {
		const jsx: JSX.Element[] = [];

		for (let i = 0; i < 10; i++) {
			jsx.push(
				<Box
					key={i}
					sx={{
						height: 57,
						borderBottom: 1,
						borderColor: 'divider'
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
				</Box>
			);
		}

		return <Stack spacing={0}>{jsx}</Stack>;
	};

	return <>{render()}</>;
};
