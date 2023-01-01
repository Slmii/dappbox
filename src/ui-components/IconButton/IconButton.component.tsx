import MUIIconButton from '@mui/material/IconButton';

import { Icon } from 'ui-components/Icon';
import { CircularProgress } from 'ui-components/Progress';
import { Tooltip } from 'ui-components/Tooltip';
import { CustomIconButtonProps } from './IconButton.types';

export const IconButton = ({ icon, label, loading, ...props }: CustomIconButtonProps) => {
	return (
		<Tooltip label={label}>
			{props.disabled ? (
				<span>
					<MUIIconButton {...props} disabled={props.disabled || loading}>
						{loading ? <CircularProgress /> : <Icon icon={icon} />}
					</MUIIconButton>
				</span>
			) : (
				<MUIIconButton {...props} disabled={props.disabled || loading}>
					{loading ? <CircularProgress /> : <Icon icon={icon} />}
				</MUIIconButton>
			)}
		</Tooltip>
	);
};
