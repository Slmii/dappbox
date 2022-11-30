import { _SERVICE, User as ControllerUser } from 'declarations/users/users.did';
import { dateFromBigInt } from 'lib/dates';
import { resolve } from 'lib/functions';
import { User as IUser } from 'lib/types/User.types';
import { Actor } from './actor';

export abstract class User {
	static async getUsers() {
		const actor = await Actor.getActor<_SERVICE>('users');

		return resolve(async () => {
			const users = await actor.get_users();
			return users.map(user => mapToUserInterface(user));
		});
	}
}

export const mapToUserInterface = (user: ControllerUser): IUser => {
	return {
		id: user.user_id,
		username: user.username.length ? user.username[0] : undefined,
		createdAt: dateFromBigInt(user.created_at)
	};
};
