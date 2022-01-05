import Divider from '@mui/material/Divider';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from 'components/header';
import { ViewActions } from 'components/view-actions';
import { ViewMode } from 'components/view-mode';
import { Providers } from 'lib/providers';
import { Box } from 'ui-components/box';
import { Breadcrumbs } from 'ui-components/breadcrumbs';
import { Container } from 'ui-components/container';
import { Drawer } from 'ui-components/drawer';

const breadcrumbsMapping: Record<string, string> = {
	'/': 'Home',
	'/authenticate': 'Authenticate'
};

export const Layout = () => {
	const { pathname } = useLocation();

	return (
		<Providers>
			<Helmet title={`${breadcrumbsMapping[pathname] ?? pathname.substring(1)} - DappBox`} />
			<Header />
			{pathname.includes('authenticate') ? (
				<Outlet />
			) : (
				<>
					<Drawer />
					<Container>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								width: '100%'
							}}
						>
							<Breadcrumbs />
							<ViewMode />
						</Box>
						<Divider />
						<ViewActions />
						<Outlet />
					</Container>
				</>
			)}
		</Providers>
	);
};
