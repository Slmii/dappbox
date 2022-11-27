import { ApiError } from 'declarations/users/users.did';

export const unwrap = <T>(result: { Ok: T } | { Err: ApiError }): Promise<T> => {
	return new Promise((resolve: (value: T) => void, reject: (error: ApiError) => void) => {
		if ('Ok' in result) {
			resolve(result.Ok);
		} else {
			reject(result.Err);
		}
	});
};
