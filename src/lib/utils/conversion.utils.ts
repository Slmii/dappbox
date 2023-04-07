/**
 * Format bytes to human readable format
 *
 * @param bytes - Bytes to format
 * @param decimals - Number of decimals
 * @returns - Formatted bytes
 */
export const formatBytes = (bytes: number, decimals = 2) => {
	if (!+bytes) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Convert a Uint32Array to a number array
 *
 * @param value - Uint32Array to convert
 * @returns - Number array
 */
export const uint32ArrayToNumbers = (value: Uint32Array | number[]) => {
	if (Array.isArray(value)) {
		return value;
	}

	return value.reduce((accum, value) => {
		accum.push(value);
		return accum;
	}, [] as number[]);
};

/**
 * Convert a Uint8Array to a number array
 *
 * @param value - Uint8Array to convert
 * @returns - Number array
 */
export const uint8ArrayToNumbers = (value: Uint8Array | number[]) => {
	if (Array.isArray(value)) {
		return value;
	}

	return value.reduce((accum, value) => {
		accum.push(value);
		return accum;
	}, [] as number[]);
};

/**
 * Replace an item in an array at a specific index
 *
 * @param array - Array to replace item in
 * @param index - Index of item to replace
 * @param newValue - New value to replace with
 * @returns - New array with replaced item
 */
export const replaceArrayAtIndex = <T>(array: T[], index: number, newValue: T): T[] => {
	const copy = [...array];
	copy[index] = newValue;
	return copy;
};
