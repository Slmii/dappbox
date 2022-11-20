import MUIIconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { Icon } from 'ui-components/Icon';
import { CustomIconButtonProps } from './IconButton.types';

export const IconButton = ({ icon, label, ...props }: CustomIconButtonProps) => {
	return (
		<Tooltip title={label ? label : ''} arrow>
			<MUIIconButton {...props}>
				<Icon icon={icon} />
			</MUIIconButton>
		</Tooltip>
	);
};
