import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { tableAssetsState } from 'lib/recoil';
import { getPageTitle } from 'lib/url';

const breadcrumbsMapping: Record<string, string> = {
	'/': 'Home',
	'/authenticate': 'Authenticate'
};

export const PageTitle = () => {
	const { pathname } = useLocation();
	const { rows } = useRecoilValue(tableAssetsState);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const pageTitle = useMemo(() => getPageTitle(pathname, rows), [pathname]);

	return <Helmet title={`${breadcrumbsMapping[pathname] ?? pageTitle} - DappBox`} />;
};
