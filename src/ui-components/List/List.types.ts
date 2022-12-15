import { Icons } from 'ui-components/icons';

export interface AssetsListProps {
	assets: ListItem[];
}

interface ListItem {
	id: number;
	name: string;
	icon?: Icons;
	isSelected?: boolean;
	disabled?: boolean;
	onClick?: (id: number) => void;
	secondaryAction?: JSX.Element;
}
