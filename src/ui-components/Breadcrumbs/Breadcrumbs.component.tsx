import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useUserAssets } from 'lib/hooks';
import { getUrlBreadcrumbs } from 'lib/url';

export const Breadcrumbs = () => {
	const { data: assets } = useUserAssets();
	const { pathname } = useLocation();

	// Split param on `/` and filter out empty values
	const params = pathname.split('/').filter(Boolean);
	const isHomePage = params.length === 0;

	const breadcrumbs = useMemo(() => {
		const breadcrumbs = params.map(param => {
			const asset = assets?.find(asset => asset.id === Number(param));
			return {
				name: asset?.name ?? '',
				id: asset?.id ?? 0
			};
		});

		return breadcrumbs;
	}, [assets, params]);

	const generateBreadcrumbPath = (assetId: number) => {
		if (!assets) {
			return '';
		}

		return getUrlBreadcrumbs(assetId, assets);
	};

	return (
		<MuiBreadcrumbs aria-label='breadcrumb' separator={<NavigateNextIcon fontSize='small' />}>
			<MuiLink
				component={isHomePage ? 'div' : Link}
				underline={isHomePage ? 'none' : 'hover'}
				color={isHomePage ? 'text.primary' : 'inherit'}
				to='/'
			>
				Home
			</MuiLink>
			{breadcrumbs.map((breadcrumb, idx) => {
				if (breadcrumbs.length === idx + 1) {
					return (
						<Typography key={breadcrumb.id} color='text.primary'>
							{breadcrumb.name}
						</Typography>
					);
				}

				return (
					<MuiLink
						key={breadcrumb.id}
						component={Link}
						underline='hover'
						color='inherit'
						to={generateBreadcrumbPath(breadcrumb.id)}
					>
						{breadcrumb.name}
					</MuiLink>
				);
			})}
		</MuiBreadcrumbs>
	);
};
