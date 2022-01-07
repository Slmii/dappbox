import { Outlet, useLocation } from 'react-router-dom';

import { Header } from 'components/header';
import { PageTitle } from 'components/page-title';
import { Providers } from 'lib/providers';
import { Drawer } from 'ui-components/drawer';

export const Layout = () => {
	const { pathname } = useLocation();

	return (
		<Providers>
			<PageTitle />
			<Header />
			{!pathname.includes('authenticate') ? <Drawer /> : null}
			<Outlet />
		</Providers>
	);
};
