import { Icons } from 'ui-components/icons';

export interface ToggleGroupProps {
	selected: string;
	onChange: (value: string | null) => void;
	options: ToggleOption[];
}

interface ToggleOption {
	icon: Icons;
	/**
	 * Value of the toggle option
	 */
	value: string;
	/**
	 * Label in the tooltip
	 */
	label: string;
}
