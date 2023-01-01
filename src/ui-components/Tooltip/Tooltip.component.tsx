import MuiTooltip from '@mui/material/Tooltip';
import { ReactElement } from 'react';

export const Tooltip = ({ label, children }: { label?: string; children: ReactElement }) => {
	return (
		<MuiTooltip title={label ? label : ''} arrow>
			{children}
		</MuiTooltip>
	);
};
