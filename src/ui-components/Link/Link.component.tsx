import MuiLink from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

import { LinkProps } from './Link.types';

export const Link: React.FC<LinkProps> = ({ href, onClick, children }) => {
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
