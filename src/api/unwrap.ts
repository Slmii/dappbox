import { Error } from 'declarations/dappbox/dappbox.did';

export const unwrap = <T>(result: { ok: T } | { err: Error }): Promise<T> => {
	return new Promise((resolve: (value: T) => void, reject: (error: Error) => void) => {
		if ('ok' in result) {
			resolve(result.ok);
		} else {
			console.trace('error', result);
			reject(result.err);
		}
	});
};
