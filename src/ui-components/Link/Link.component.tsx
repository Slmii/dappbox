import MuiLink from '@mui/material/Link';
import { PropsWithChildren } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { LinkProps } from './Link.types';

export const Link = ({ href, onClick, children }: PropsWithChildren<LinkProps>) => {
	return (
		<MuiLink
			component={RouterLink}
			to={href}
			sx={{
				color: 'text.primary',
				textDecoration: 'unset'
			}}
			onClick={onClick}
		>
			{children}
		</MuiLink>
	);
};
