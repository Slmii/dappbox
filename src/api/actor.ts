import { ActorSubclass } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

import { createActor } from 'declarations/users';
import { _SERVICE } from 'declarations/users/users.did';
import canisters from './canister_ids.json';

type Controller = keyof typeof canisters;
const environment = process.env.REACT_APP_ENV ?? 'local';
const isLocal = environment === 'local';

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

		const canisterEnv = canisters[controller];
		const canisterId = canisterEnv[environment as keyof typeof canisterEnv];

		const actor = createActor(canisterId, {
			agentOptions: {
				identity: authClient.getIdentity(),
				host: isLocal ? 'http://localhost:8000' : 'https://ic0.app'
			}
		});

		this.actor[controller] = actor;

		return actor;
	}
}
