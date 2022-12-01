import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from 'lib/context';
import { Box, Row } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { PageTitle } from 'ui-components/Typography';

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
			<Row>
				<PageTitle title='DappBox' />
				<Button
					label='Login with Internet Identity'
					color='primary'
					variant='contained'
					loading={isLoading}
					onClick={loginII}
					startImage='/assets/dfn.svg'
					size='large'
				/>
			</Row>
		</Box>
	);
};
