import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from 'lib/context';
import { Box, RowBox } from 'ui-components/box';
import { Button } from 'ui-components/button';
import { Divider } from 'ui-components/divider';
import { PageTitle } from 'ui-components/typography';

export const Authenticate = () => {
	const { isAuthenticated, loginII, isLoading } = useContext(AuthContext);

	if (isAuthenticated) {
		return <Navigate to='/' />;
	}

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
				<PageTitle title='DappBox' />
				<Divider />
				<Button
					label='Authenticate with II'
					color='primary'
					variant='contained'
					loading={isLoading}
					onClick={loginII}
					startImage='/assets/dfn.svg'
					size='large'
				/>
			</RowBox>
		</Box>
	);
};
