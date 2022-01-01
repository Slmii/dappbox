import { Outlet, useLocation } from 'react-router-dom';

import { Header } from 'components/header';
import { Providers } from 'lib/providers';
import { Box } from 'ui-components/box';
import { Container } from 'ui-components/container';
import { Drawer } from 'ui-components/drawer';

export const Layout = () => {
	const location = useLocation();

	console.log(location);

	return (
		<Providers>
			<Header />
			{location.pathname.includes('authenticate') ? (
				<Outlet />
			) : (
				<>
					<Drawer />
					<Container>
						<Box>Breadcrumbs</Box>
						<Outlet />
					</Container>
				</>
			)}
		</Providers>
	);
};
