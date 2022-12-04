import { IconButtonProps } from '@mui/material/IconButton';

import { Icons } from 'ui-components/icons';

export interface CustomIconButtonProps extends IconButtonProps {
	icon: Icons;
	label?: string;
	loading?: boolean;
}
