import { SvgIconProps } from '@mui/material/SvgIcon';

import { Icons } from 'ui-components/icons';

export interface IconProps extends SvgIconProps {
	icon: Icons;
	/**
	 * If there should be spacing on the right side of the icon.
	 */
	spacingLeft?: boolean;
	/**
	 * If there should be spacing on the left side of the icon.
	 */
	spacingRight?: boolean;
	label?: string;
}
