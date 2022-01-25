import { Icons } from 'ui-components/icons';

export interface AssetsListProps {
	assets: Asset[];
}

interface Asset {
	assetId: number;
	name: string;
	icon?: Icons;
	isSelected?: boolean;
	onClick?: (assetId: number) => void;
	secondaryAction?: {
		icon: Icons;
		label: string;
		onClick: (assetId: number) => void;
	};
}
