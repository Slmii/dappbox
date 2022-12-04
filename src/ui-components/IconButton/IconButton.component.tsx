import MUIIconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { Icon } from 'ui-components/Icon';
import { CircularProgress } from 'ui-components/Progress';
import { CustomIconButtonProps } from './IconButton.types';

export const IconButton = ({ icon, label, loading, ...props }: CustomIconButtonProps) => {
	return (
		<Tooltip title={label ? label : ''} arrow>
			<MUIIconButton {...props} disabled={props.disabled || loading}>
				{loading ? <CircularProgress /> : <Icon icon={icon} />}
			</MUIIconButton>
		</Tooltip>
	);
};
