import { Asset } from 'declarations/dappbox/dappbox.did';
import { Order } from 'ui-components/Table';

export const getTableAssets = ({
	assets,
	assetId,
	order,
	orderBy
}: {
	assets: Asset[];
	assetId?: string | number;
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
				if (asset.parentId[0]?.toString() === decodeURIComponent(assetId.toString())) {
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

export const replaceAsset = ({ assets, index, value }: { assets: Asset[]; index: number; value: Asset }) => {
	return [...assets.slice(0, index), value, ...assets.slice(index + 1)];
};
