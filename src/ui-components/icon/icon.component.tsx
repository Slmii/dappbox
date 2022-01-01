import { icons } from 'ui-components/icons';
import { IconProps } from './icon.types';

export const Icon = ({ spacingLeft, spacingRight, icon, ...props }: IconProps) => {
	const IconComponent = icons[icon as keyof typeof icons];

	return (
		<IconComponent
			{...props}
			sx={{
				ml: spacingLeft ? 1 : 0,
				mr: spacingRight ? 1 : 0
			}}
		/>
	);
};
