import { Asset } from 'lib/types/Asset.types';
import { Icons } from 'ui-components/icons';

export type Order = 'asc' | 'desc';

export type Column = {
	[key in keyof Partial<Asset>]: ColumnOptions;
};

export interface TableProps {
	rows: Asset[];
	selectedRows: Asset[];
	columns: Column;
	order: Order;
	orderBy: keyof Asset;
	setSelectedRows: (rows: Asset[]) => void;
	setOrder: (order: Order) => void;
	setOrderBy: (orderBy: keyof Asset) => void;
	onFavoriteToggle: (assetId: number) => void;
}

export interface ColumnOptions {
	label: string;
	sortable: boolean;
	alignment: 'left' | 'center' | 'right';
	type: 'string' | 'icon' | 'date' | 'bigint';
	icon?: Icons;
	iconAlt?: Icons;
}

export interface TableHeadProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Asset) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
	columns: Column;
}

export interface TableCellProps {
	columnId: keyof Column;
	column: ColumnOptions;
	row: Asset;
	onFavoriteToggle: (assetId: number) => void;
}
