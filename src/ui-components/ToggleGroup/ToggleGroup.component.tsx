import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';

import { Icon } from 'ui-components/Icon';
import { ToggleGroupProps } from './ToggleGroup.types';

export const ToggleGroup = ({ selected, onChange, options }: ToggleGroupProps) => {
	return (
		<ToggleButtonGroup
			orientation='horizontal'
			exclusive
			onChange={(_, value) => onChange(value)}
			size='medium'
			color='primary'
		>
			{options.map(option => (
				<Tooltip key={option.value} arrow title={option.label}>
					<ToggleButton value={option.value} aria-label={option.value} selected={selected === option.value}>
						<Icon icon={option.icon} fontSize='small' />
					</ToggleButton>
				</Tooltip>
			))}
		</ToggleButtonGroup>
	);
};
