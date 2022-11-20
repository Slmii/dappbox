import { ActorSubclass } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

import { canisterId, createActor } from 'declarations/dappbox';
import { _SERVICE } from 'declarations/dappbox/dappbox.did';
import { loadIIAuthClient } from 'lib/auth';

export abstract class Actor {
	static authClient: AuthClient | undefined = undefined;
	static actor: ActorSubclass<_SERVICE> | undefined = undefined;

	static async setAuthClient(authClient: AuthClient) {
		this.authClient = authClient;
	}

	static async getActor() {
		if (!this.authClient) {
			this.authClient = await loadIIAuthClient();
		}

		const identity = this.authClient.getIdentity();
		const actor = createActor(canisterId, {
			agentOptions: {
				identity
			}
		});

		return actor;
	}

	static setActor(actor: ActorSubclass<_SERVICE>) {
		this.actor = actor;
	}
}
