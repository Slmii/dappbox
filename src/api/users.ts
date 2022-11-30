import { _SERVICE, User as ControllerUser } from 'declarations/users/users.did';
import { dateFromBigInt } from 'lib/dates';
import { resolve, unwrap } from 'lib/functions';
import { User as IUser } from 'lib/types/User.types';
import { Actor } from './actor';

export abstract class User {
	static async getUser() {
		const actor = await Actor.getActor<_SERVICE>('users');

		return resolve(async () => {
			const response = await actor.get_user();
			const user = await unwrap(response);

			return mapToUserInterface(user);
		});
	}

	static async getUsers() {
		const actor = await Actor.getActor<_SERVICE>('users');

		return resolve(async () => {
			const users = await actor.get_users();
			return users.map(user => mapToUserInterface(user));
		});
	}

	static async createUser() {
		const actor = await Actor.getActor<_SERVICE>('users');

		return resolve(async () => {
			const response = await actor.create_user([]);
			const user = await unwrap(response);

			return mapToUserInterface(user);
		});
	}
}

const mapToUserInterface = (user: ControllerUser): IUser => {
	return {
		id: user.user_id,
		username: user.username.length ? user.username[0] : undefined,
		createdAt: dateFromBigInt(user.created_at)
	};
};
