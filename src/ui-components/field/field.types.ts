import { Icons } from 'ui-components/icons';

export interface FieldProps {
	name: string;
	label?: string;
	type?: string;
	required?: boolean;
	optional?: boolean;
	disabled?: boolean;
	placeholder?: string;
	fullWidth?: boolean;
	size?: 'small' | 'medium';
	readOnly?: boolean;
	onChange?: (value: string) => void;
	startIcon?: Icons;
	endIcon?: Icons;
}
