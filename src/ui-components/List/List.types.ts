import { Icons } from 'ui-components/icons';

export interface AssetsListProps {
	assets: ListItem[];
}

interface ListItem {
	id: number;
	name: string;
	icon?: Icons;
	isSelected?: boolean;
	onClick?: (id: number) => void;
	secondaryAction?: {
		icon: Icons;
		label: string;
		onClick: (id: number) => void;
		disabled?: boolean;
		loading?: boolean;
	};
}
