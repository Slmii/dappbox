import { Icons } from 'ui-components/icons';

export interface MenuProps {
	label: JSX.Element;
	id: string;
	menu: Menu[];
	fullWidth?: boolean;
}

interface Menu {
	label: string;
	href?: string;
	icon?: Icons;
	/**
	 * Image in the `public/assets` folder
	 */
	image?: string;
	action?: () => void;
	disabled?: boolean;
}
