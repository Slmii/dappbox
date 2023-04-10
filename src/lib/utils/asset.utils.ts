import { Principal } from '@dfinity/principal';

import { PostAsset } from 'declarations/assets/assets.did';
import { MAX_UPLOAD_LIMIT } from 'lib/constants/upload.constants';
import { Asset, AssetType, FileCount, NestedFileObject } from 'lib/types';
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
	return assets.find(a => {
		if ('Folder' in asset.asset_type) {
			return a.name === asset.name && a.parentId === asset.parent_id[0];
		}

		return a.name === asset.name && a.parentId === asset.parent_id[0] && a.mimeType === asset.mime_type;
	});
};

/**
 * Validate the size of the files to upload
 *
 * @param files - Files to validate
 * @returns - True if valid, false if not
 */
export const validateUploadSize = (files: File[]) => {
	// Max size validation
	if (files.some(file => file.size > MAX_UPLOAD_LIMIT)) {
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

/**
 * Build a nested object from a FileList
 *
 * @param files - FileList to build the nested object from
 */
export const buildNestedFiles = (files: File[]): NestedFileObject => {
	const result: NestedFileObject = {};

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const pathParts = file.webkitRelativePath.split('/');
		let currentObject = result;

		for (let j = 0; j < pathParts.length; j++) {
			const pathPart = pathParts[j];

			if (j === pathParts.length - 1) {
				currentObject[pathPart] = file;
			} else {
				if (!currentObject[pathPart]) {
					currentObject[pathPart] = {};
				}
				currentObject = currentObject[pathPart] as NestedFileObject;
			}
		}
	}

	return result;
};

/**
 * This function is recursive and will call the onFile and onFolder functions for each file and folder.
 *
 * @param obj - Nested object to add activities to
 * @param fns - Functions to call for each file and folder
 * @returns - Promise that resolves when all activities are added
 */
export const addNestedFileActivities = async <T>(
	obj: NestedFileObject,
	fns: { onFile: (file: File) => Promise<T> | T; onFolder: (name: string) => Promise<T> | T }
) => {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key];

			// If the value is a file, call the onFile function
			if (value instanceof File) {
				await fns.onFile(value);
			} else if (typeof value === 'object') {
				// If the value is an object, call the onFolder function
				await fns.onFolder(key);

				// Recursively call this function
				await addNestedFileActivities(value as NestedFileObject, fns);
			}
		}
	}
};

/**
 * Set the post asset data
 *
 * @param name - Name of the asset
 * @param assetType - Type of the asset
 * @param placeholderId - Placeholder ID
 * @param extension - Extension of the asset
 * @param mimeType - Mime type of the asset
 * @param userId - User ID
 * @param size - Size of the asset
 * @param parentId - Parent ID
 * @returns - Post asset data
 */
export const setPostAsset = ({
	name,
	assetType,
	placeholderId,
	extension,
	mimeType,
	userId,
	size,
	parentId
}: {
	placeholderId: number;
	assetType: AssetType;
	name: string;
	extension: string;
	mimeType: string;
	size: number;
	userId: Principal;
	parentId?: number;
}) => {
	// Create PostAsset data
	const postData: PostAsset & { placeholderId: number } = {
		placeholderId,
		id: [],
		asset_type:
			assetType === 'folder'
				? {
						Folder: null
				  }
				: { File: null },
		chunks: [],
		extension,
		mime_type: mimeType,
		name,
		parent_id: parentId ? [parentId] : [],
		size,
		user_id: userId,
		settings: {
			privacy: {
				Public: null
			},
			url: []
		}
	};

	return postData;
};

/**
 * Count the number of files and folders in a nested object
 *
 * @param obj - Nested object to count files and folders in
 * @param count - Object to store the count in
 * @returns - Object with the count
 */
export const countFilesAndFolders = (obj: NestedFileObject, count: FileCount = { files: 0, folders: 0 }): FileCount => {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key];

			if (value instanceof File) {
				count.files++;
			} else if (typeof value === 'object') {
				count.folders++;
				count = countFilesAndFolders(value as NestedFileObject, count);
			}
		}
	}

	return count;
};
