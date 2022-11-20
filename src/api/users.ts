import { Actor } from './actor';
import { unwrap } from './unwrap';

export abstract class User {
	static async getUser() {
		const actor = await Actor.getActor();

		const response = await actor.getUser();
		return unwrap(response);
	}

	static async createUser() {
		const actor = await Actor.getActor();

		const response = await actor.createUser();
		return unwrap(response);
	}
}
