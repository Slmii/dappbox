import { Actor } from './actor';
import { unwrap } from './unwrap';

export abstract class User {
	static async getUser() {
		const actor = await Actor.getActor('users');

		const response = await actor.get_user();
		return unwrap(response);
	}

	static async createUser() {
		const actor = await Actor.getActor('users');

		const response = await actor.create_user([]);
		return unwrap(response);
	}
}
