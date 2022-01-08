import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { assetsAtom } from 'lib/recoil';
import { getUrlPathToAsset } from 'lib/url';

export const Breadcrumbs = () => {
	const { assets } = useRecoilValue(assetsAtom);
	const { pathname } = useLocation();

	// Split param on `/` and filter out empty values
	const params = pathname.split('/').filter(Boolean);
	const isHomePage = params.length === 0;

	const breadcrumbs = useMemo(() => {
		const breadcrumbs = params.map(param => {
			const asset = assets.find(asset => asset.assetId === Number(param));
			return {
				name: asset?.name ?? '',
				assetId: asset?.assetId ?? 0
			};
		});

		return breadcrumbs;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const generateBreadcrumbPath = (assetId: number) => {
		return getUrlPathToAsset(assetId, assets)
			.map(asset => encodeURIComponent(asset.assetId))
			.join('/');
	};

	return (
		<MuiBreadcrumbs aria-label='breadcrumb' separator={<NavigateNextIcon fontSize='small' />}>
			<MuiLink
				component={isHomePage ? 'div' : Link}
				underline={isHomePage ? 'none' : 'hover'}
				color={isHomePage ? 'text.primary' : 'inherit'}
				to='/'
			>
				DappBox
			</MuiLink>
			{breadcrumbs.map((breadcrumb, idx) => {
				if (breadcrumbs.length === idx + 1) {
					return (
						<Typography key={breadcrumb.assetId} color='text.primary'>
							{breadcrumb.name}
						</Typography>
					);
				}

				return (
					<MuiLink
						key={breadcrumb.assetId}
						component={Link}
						underline='hover'
						color='inherit'
						to={generateBreadcrumbPath(breadcrumb.assetId)}
					>
						{breadcrumb.name}
					</MuiLink>
				);
			})}
		</MuiBreadcrumbs>
	);
};
