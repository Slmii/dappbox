import { Order } from 'ui-components/table';
import { Asset } from './generated/dappbox_types';

export const getTableAssets = ({
	assets,
	assetId,
	order,
	orderBy
}: {
	assets: Asset[];
	assetId?: string;
	order: Order;
	orderBy: keyof Asset;
}) => {
	const assetsToSort = [...assets];
	const folders: Asset[] = [];
	const files: Asset[] = [];

	assetsToSort
		// Return assets linked to the assetId (parent) in the URL
		// If homepage, then only return assets that do not have a parent
		.reduce((accum, asset) => {
			if (!assetId) {
				if (!asset.parentId.length) {
					accum.push(asset);
				}
			} else {
				if (asset.parentId[0]?.toString() === decodeURIComponent(assetId)) {
					accum.push(asset);
				}
			}

			return accum;
		}, [] as Asset[])
		// Sort assets
		.sort((a, b) => (order === 'desc' ? descendingComparator(a, b, orderBy) : -descendingComparator(a, b, orderBy)))
		// Seperate assets between folders and files
		.forEach(row => (row.assetType === 'folder' ? folders.push(row) : files.push(row)));

	// Always shows files first
	if (orderBy === 'extension' || orderBy === 'size') {
		return [...files, ...folders];
	}

	// If orderBy `name` then: `asc` is folders first, `desc` is files first
	return order === 'asc' ? [...folders, ...files] : [...files, ...folders];
};

export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}

	if (b[orderBy] > a[orderBy]) {
		return 1;
	}

	return 0;
};
