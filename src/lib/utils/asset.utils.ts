import { PostAsset } from 'declarations/assets/assets.did';
import { MAX_UPLOAD_LIMIT } from 'lib/constants/upload.constants';
import { Asset } from 'lib/types';
import { Order } from 'ui-components/Table';

/**
 * Takes an array of assets and returns an array of assets sorted by the `orderBy` and `order` parameters.
 *
 * @param param0 - Object containing the assets, the assetId (parent), the order and the orderBy
 * @returns - Array of assets sorted by the `orderBy` and `order` parameters
 */
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
		.forEach(asset => (asset.type === 'folder' ? folders.push(asset) : files.push(asset)));

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

/**
 * Find an existing asset in an array of assets
 *
 * @param assets - Array of assets to search
 * @param asset - Asset to find
 * @returns - Existing asset or undefined
 */
export const findExistingAsset = (assets: Asset[], asset: PostAsset) => {
	return assets.find(
		a =>
			a.name === asset.name &&
			a.parentId === asset.parent_id[0] &&
			a.type === ('File' in asset.asset_type ? 'file' : 'folder') &&
			a.mimeType === asset.mime_type
	);
};

/**
 * Validate the size of the files to upload
 *
 * @param files - Files to validate
 * @returns - True if valid, false if not
 */
export const validateUploadSize = (files: FileList) => {
	// Convert FilesList to array
	const filesAsArray = Array.from(files);

	// Max size validation
	if (filesAsArray.some(file => file.size > MAX_UPLOAD_LIMIT)) {
		return false;
	}

	return true;
};

/**
 * Get the extension of a file
 *
 * @param name - Name of the file
 * @returns - Extension of the file
 */
export const getExtension = (name: string) => {
	return name.split('.').pop() ?? '';
};

/**
 * Save a blob as a file
 *
 * @param blob - Blob to save
 * @param name - Name of the file
 */
export const saveAs = (blob: Blob, name: string) => {
	const url = window.URL.createObjectURL(blob);

	// Create a link to the file and set the download attribute
	const downloadLink = document.createElement('a');
	downloadLink.href = url;
	downloadLink.setAttribute('download', name);
	downloadLink.click();

	downloadLink.addEventListener('click', function () {
		URL.revokeObjectURL(url);
	});
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
