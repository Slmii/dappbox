import * as actor from './actor';
import * as assets from './assets';
import * as chunks from './chunks';
import * as users from './users';

export const api = {
	...users,
	...actor,
	...chunks,
	...assets
};
