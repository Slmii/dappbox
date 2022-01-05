import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs = () => {
	const { pathname } = useLocation();

	// Split param on `/` and filter out empty values
	const params = pathname.split('/').filter(Boolean);
	const isHomePage = params.length === 0;

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
			{params.map((param, idx) => {
				if (params.length === idx + 1) {
					return <Typography color='text.primary'>{param}</Typography>;
				}

				return (
					<MuiLink key={param} component={Link} underline='hover' color='inherit' to={`/${param}`}>
						{param}
					</MuiLink>
				);
			})}
		</MuiBreadcrumbs>
	);
};
