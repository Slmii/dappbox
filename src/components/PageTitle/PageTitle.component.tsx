import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { useUserAssets } from 'lib/hooks';
import { getPageTitle } from 'lib/url';

const breadcrumbsMapping: Record<string, string> = {
	'/': 'Home',
	'/authenticate': 'Authenticate',
	'/favorites': 'Favorites'
};

export const PageTitle = () => {
	const { pathname } = useLocation();
	const { data: assets } = useUserAssets();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const pageTitle = useMemo(() => {
		if (!assets) {
			return '';
		}

		return getPageTitle(pathname, assets);
	}, [pathname, assets]);

	return <Helmet title={`${breadcrumbsMapping[pathname] ?? pageTitle} - DappBox`} />;
};
