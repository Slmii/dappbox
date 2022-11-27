import { ActorSubclass } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

import { createActor } from 'declarations/users';
import { _SERVICE } from 'declarations/users/users.did';
import canisters from './canister_ids.json';

type Controller = keyof typeof canisters;

export abstract class Actor {
	static authClient: AuthClient | undefined = undefined;
	static actor: Record<string, ActorSubclass<_SERVICE>> = {};

	static async setAuthClient(authClient: AuthClient) {
		this.authClient = authClient;
	}

	static async getAuthClient() {
		if (this.authClient) {
			return this.authClient;
		}

		return AuthClient.create();
	}

	static async getActor(controller: Controller) {
		if (this.actor[controller]) {
			return this.actor[controller];
		}

		const authClient = await this.getAuthClient();
		const actor = createActor(canisters[controller].ic, {
			agentOptions: {
				identity: authClient.getIdentity(),
				host: 'https://ic0.app'
			}
		});

		this.actor[controller] = actor;

		return actor;
	}
}
