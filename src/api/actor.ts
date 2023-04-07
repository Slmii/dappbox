import { Actor as DfinityActor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';

import { idlFactory as idlFactoryAssets } from 'declarations/assets';
import { idlFactory as idlFactoryChunks } from 'declarations/chunks';
import { idlFactory as idlFactoryUsers } from 'declarations/users';
import { ENVIRONMENT, IS_LOCAL } from 'lib/constants/env.constants';
import canisters from './canister_ids.json';

type Controller = keyof typeof canisters;
const idlFactoryMapping: Record<Controller, IDL.InterfaceFactory> = {
	assets: idlFactoryAssets,
	users: idlFactoryUsers,
	chunks: idlFactoryChunks
};

export abstract class Actor {
	static authClient: AuthClient | undefined = undefined;

	static async setAuthClient(authClient: AuthClient) {
		this.authClient = authClient;
	}

	static async getAuthClient() {
		if (this.authClient) {
			return this.authClient;
		}

		return AuthClient.create({
			idleOptions: {
				disableDefaultIdleCallback: true,
				disableIdle: true
			}
		});
	}

	static async getActor<T>(controller: Controller, canisterPrincipal?: Principal): Promise<ActorSubclass<T>> {
		const authClient = await this.getAuthClient();

		const canisterEnv = canisters[controller];
		const canisterId = canisterPrincipal ?? canisterEnv[ENVIRONMENT as keyof typeof canisterEnv];

		const actor = DfinityActor.createActor<T>(idlFactoryMapping[controller], {
			agent: new HttpAgent({
				host: IS_LOCAL ? 'http://localhost:8000' : 'https://ic0.app',
				identity: authClient.getIdentity()
			}),
			canisterId
		});

		return actor;
	}
}
