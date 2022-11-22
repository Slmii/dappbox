import { ActorSubclass } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

import { canisterId, createActor } from 'declarations/dappbox';
import { _SERVICE } from 'declarations/dappbox/dappbox.did';
import { getLocalStorageIdentity, loadIIAuthClient } from 'lib/auth';

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

		if (this.actor) {
			return this.actor;
		}

		const actor = createActor(canisterId, {
			agentOptions: {
				identity: getLocalStorageIdentity(),
				host: 'https://ic0.app'
			}
		});

		return actor;
	}

	static setActor(actor: ActorSubclass<_SERVICE>) {
		this.actor = actor;
	}
}
