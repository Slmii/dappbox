import { Outlet } from 'react-router-dom';

import { Header } from 'components/header';
import { PageTitle } from 'components/page-title';
import { Providers } from 'lib/providers';

export const Layout = () => {
	return (
		<Providers>
			<PageTitle />
			<Header />
			<Outlet />
		</Providers>
	);
};
