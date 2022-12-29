import { Order } from 'ui-components/Table';
import { Asset } from './';

export interface TableState {
	selectedAssets: Asset[];
	order: Order;
	orderBy: keyof Asset;
}
