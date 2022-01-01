import { IconButtonProps } from '@mui/material/IconButton';

import { Icons } from 'ui-components/icons';

export interface CustomIconProps extends IconButtonProps {
	icon: Icons;
	label?: string;
}
