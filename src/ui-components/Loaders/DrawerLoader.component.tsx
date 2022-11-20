import Skeleton from '@mui/material/Skeleton';

import { Box } from 'ui-components/Box';

export const DrawerLoader = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexGrow: 1
			}}
		>
			<Skeleton
				animation='wave'
				sx={{
					width: '100%',
					height: '100%',
					transform: 'unset',
					borderRadius: 0
				}}
			/>
		</Box>
	);
};
