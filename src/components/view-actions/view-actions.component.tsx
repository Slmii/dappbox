import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { Box } from 'ui-components/box';
import { Button } from 'ui-components/button';

export const ViewActions = () => {
	return (
		<Toolbar
			sx={{
				pl: { sm: 0, md: 0 },
				pr: { sm: 0, md: 0 }
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					'& > *:not(:last-child)': {
						marginRight: 1
					}
				}}
			>
				<Button label='Add folder' startIcon='addFolderOutlined' variant='contained' color='inherit' />
				{5 > 0 ? (
					<>
						{true ? (
							<Button label='Preview' startIcon='viewOutlined' variant='outlined' color='inherit' />
						) : null}
						<Button label='Download' startIcon='downloadOutlined' variant='outlined' color='inherit' />
						<Button label='Move' variant='outlined' startIcon='folderOutlined' color='inherit' />
						<Button label='Copy' startIcon='copyOutlined' variant='outlined' color='inherit' />
						<Button label='Delete' startIcon='deleteOutlined' color='error' />
						<Typography sx={{ marginLeft: 'auto' }} color='inherit' variant='caption' fontWeight='bold'>
							{5} selected
						</Typography>
					</>
				) : null}
			</Box>
		</Toolbar>
	);
};
