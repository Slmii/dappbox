import Tooltip from '@mui/material/Tooltip';

import { icons } from 'ui-components/icons';
import { IconProps } from './Icon.types';

export const Icon = ({ spacingLeft, spacingRight, icon, label, ...props }: IconProps) => {
	const IconComponent = icons[icon as keyof typeof icons];

	return (
		<Tooltip title={label ? label : ''} arrow>
			<IconComponent
				{...props}
				sx={{
					...props.sx,
					ml: spacingLeft ? 1 : 0,
					mr: spacingRight ? 1 : 0
				}}
			/>
		</Tooltip>
	);
};
