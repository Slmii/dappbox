import { Actor as DfinityActor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

import { idlFactory } from 'declarations/users';
import canisters from './canister_ids.json';

type Controller = keyof typeof canisters;
const environment = process.env.REACT_APP_ENV ?? 'local';
const isLocal = environment === 'local';

export abstract class Actor {
	static authClient: AuthClient | undefined = undefined;
	static actor: Record<string, ActorSubclass<unknown>> = {};

	static async setAuthClient(authClient: AuthClient) {
		this.authClient = authClient;
	}

	static async getAuthClient() {
		if (this.authClient) {
			return this.authClient;
		}

		return AuthClient.create();
	}

	static async getActor<T>(controller: Controller): Promise<ActorSubclass<T>> {
		if (this.actor[controller]) {
			return this.actor[controller] as ActorSubclass<T>;
		}

		const authClient = await this.getAuthClient();

		const canisterEnv = canisters[controller];
		const canisterId = canisterEnv[environment as keyof typeof canisterEnv];

		const actor = DfinityActor.createActor<T>(idlFactory, {
			agent: new HttpAgent({
				host: isLocal ? 'http://localhost:8000' : 'https://ic0.app',
				identity: authClient.getIdentity()
			}),
			canisterId: canisterId
		});

		this.actor[controller] = actor;

		return actor;
	}
}
