import { ButtonProps } from '@mui/material/Button';

import { Icons } from 'ui-components/icons';

export interface CustomButtonProps extends ButtonProps {
	label?: string;
	tooltip?: string;
	loading?: boolean;
	startIcon?: Icons;
	endIcon?: Icons;
	startImage?: string;
	endImage?: string;
}
