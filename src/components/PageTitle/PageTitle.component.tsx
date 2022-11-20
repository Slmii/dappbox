import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { assetsAtom } from 'lib/recoil';
import { getPageTitle } from 'lib/url';

const breadcrumbsMapping: Record<string, string> = {
	'/': 'Home',
	'/authenticate': 'Authenticate',
	'/favorites': 'Favorites'
};

export const PageTitle = () => {
	const { pathname } = useLocation();
	const { assets } = useRecoilValue(assetsAtom);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const pageTitle = useMemo(() => getPageTitle(pathname, assets), [pathname]);

	return <Helmet title={`${breadcrumbsMapping[pathname] ?? pageTitle} - DappBox`} />;
};
