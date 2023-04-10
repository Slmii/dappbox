import { _SERVICE, User as ControllerUser } from 'declarations/users/users.did';
import { User as IUser } from 'lib/types';
import { dateFromBigInt } from 'lib/utils/date.utils';
import { resolve, unwrap } from 'lib/utils/unwrap.utils';
import { Actor } from './actor';

export abstract class Users {
	static async getUsers() {
		const actor = await Actor.getActor<_SERVICE>('users');

		return resolve(async () => {
			const response = await actor.get_all_users();
			const unwrapped = await unwrap(response);

			return unwrapped.map(user => mapToUserInterface(user));
		});
	}
}

export const mapToUserInterface = (user: ControllerUser): IUser => {
	return {
		id: user.user_id,
		username: user.username.length ? user.username[0] : undefined,
		createdAt: dateFromBigInt(user.created_at),
		canisters: user.canisters,
		aliasUserIds: user.alias_user_ids.length ? user.alias_user_ids[0] : []
	};
};
