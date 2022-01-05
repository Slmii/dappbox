import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';

import { AuthContext } from 'lib/context';
import { Box, RowBox } from 'ui-components/box';
import { Button } from 'ui-components/button';

export const Authenticate = () => {
	const { loginPlug, isLoading } = useContext(AuthContext);

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				width: '500px',
				margin: '0 auto',
				padding: '30px',
				textAlign: 'center'
			}}
		>
			<RowBox>
				<Typography variant='h3' component='h1' fontWeight='bold'>
					DappBox
				</Typography>
				<Divider />
				<Button
					label='Authenticate with plug'
					variant='contained'
					loading={isLoading}
					onClick={loginPlug}
					startImage='/assets/plug-wallet.png'
					size='large'
				/>
				<Button
					label='Authenticate with II'
					color='secondary'
					variant='contained'
					onClick={() => alert('TODO')}
					startImage='/assets/dfn.svg'
					size='large'
				/>
			</RowBox>
		</Box>
	);
};
