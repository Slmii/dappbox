import { Outlet, useLocation } from 'react-router-dom';

import { Header } from 'components/Header';
import { PageTitle } from 'components/PageTitle';
import { Providers } from 'lib/providers';
import { Drawer } from 'ui-components/Drawer';

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
