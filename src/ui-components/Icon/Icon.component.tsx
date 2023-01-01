import { icons } from 'ui-components/icons';
import { Tooltip } from 'ui-components/Tooltip';
import { IconProps } from './Icon.types';

export const Icon = ({ spacingLeft, spacingRight, icon, label, ...props }: IconProps) => {
	const IconComponent = icons[icon as keyof typeof icons];

	return (
		<Tooltip label={label}>
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
