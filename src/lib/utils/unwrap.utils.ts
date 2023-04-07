import { ApiError } from 'declarations/users/users.did';

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
