import { Outlet, useLocation } from 'react-router-dom';

import { Header } from 'components/Header';
import { PageTitle } from 'components/PageTitle';
import { useInitAssets } from 'lib/hooks';
import { Providers } from 'lib/providers';
import { Drawer } from 'ui-components/Drawer';

export const Layout = () => {
	const { pathname } = useLocation();

	useInitAssets();

	return (
		<Providers>
			<PageTitle />
			<Header />
			{!pathname.includes('authenticate') ? <Drawer /> : null}
			<Outlet />
		</Providers>
	);
};
