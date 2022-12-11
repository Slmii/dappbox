import { ApiError } from 'declarations/users/users.did';
import { Asset } from 'lib/types/Asset.types';
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
				if (!asset.parentId) {
					accum.push(asset);
				}
			} else {
				if (asset.parentId?.toString() === decodeURIComponent(assetId.toString())) {
					accum.push(asset);
				}
			}

			return accum;
		}, [] as Asset[])
		// Sort assets
		.sort((a, b) => (order === 'desc' ? descendingComparator(a, b, orderBy) : -descendingComparator(a, b, orderBy)))
		// Seperate assets between folders and files
		.forEach(row => (row.type === 'folder' ? folders.push(row) : files.push(row)));

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

export const getImage = async (file: File) => {
	const createChunks = (file: File, cSize: number /* cSize should be byte 1024*1 = 1KB */) => {
		let startPointer = 0;
		let endPointer = file.size;
		let chunks = [];

		while (startPointer < endPointer) {
			let newStartPointer = startPointer + 1024 * cSize;
			chunks.push(file.slice(startPointer, newStartPointer));
			startPointer = newStartPointer;
		}

		return chunks;
	};

	const arrayBuffers = await Promise.all(createChunks(file, 500).map(blob => blob.arrayBuffer()));
	const blob = new Blob(arrayBuffers);
	const preview = URL.createObjectURL(blob);

	return {
		preview,
		blobs: arrayBuffers.map(chunk => new Uint8Array(chunk))
	};
};

export const unwrap = <T>(result: { Ok: T } | { Err: ApiError }): Promise<T> => {
	return new Promise((resolve: (value: T) => void, reject: (error: { error: ApiError }) => void) => {
		if ('Ok' in result) {
			resolve(result.Ok);
		} else {
			reject({
				error: result.Err
			});
		}
	});
};

export const resolve = async <T>(fn: () => Promise<T>): Promise<T> => {
	return fn()
		.then(response => response)
		.catch(error => {
			console.trace('Error', error);
			const typedError = error as Record<'error', ApiError> | Error | string;

			if (typeof typedError === 'string') {
				throw new Error(typedError);
			} else if ('error' in typedError) {
				throw new Error(Object.values(typedError.error)[0]);
			} else {
				throw new Error(typedError.message);
			}
		});
};

export const formatBytes = (bytes: number, decimals = 2) => {
	if (!+bytes) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const replaceArrayAtIndex = <T>(array: T[], index: number, newValue: T): T[] => {
	const copy = [...array];
	copy[index] = newValue;
	return copy;
};

export const getExtension = (name: string) => {
	return name.split('.').pop() ?? '';
};

export const uintArrayToNumbers = (value: Uint32Array) => {
	return value.reduce((accum, value) => {
		accum.push(value);
		return accum;
	}, [] as number[]);
};
