import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { AuthClient, LocalStorage } from '@dfinity/auth-client';
import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity';

import { idlFactory } from 'declarations/dappbox';
import { _SERVICE } from 'declarations/dappbox/dappbox.did';

export const loadIIAuthClient = () => {
	return AuthClient.create();
	// {
	// 	storage: new LocalStorage(''),
	// 	idleOptions: {
	// 		disableDefaultIdleCallback: true,
	// 		disableIdle: true
	// 	}
	// }
};

export async function getLocalStorageIdentity() {
	const identityKey = await getLocalStorageItem('identity');
	const delegationChain = await getLocalStorageItem('delegation');

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const chain = DelegationChain.fromJSON(delegationChain!);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const key = Ed25519KeyIdentity.fromJSON(identityKey!);

	const identity: Identity = DelegationIdentity.fromDelegation(key, chain);

	return identity;
}

export const getLocalStorageItem = async (key: string) => {
	const storage = new LocalStorage('');
	return storage.get(key);
};

export const setLocalStorageItem = async (key: string, value: string) => {
	const storage = new LocalStorage('');
	return storage.set(key, value);
};

export const removeLocalStorageItem = async (key: string) => {
	const storage = new LocalStorage('');
	return storage.remove(key);
};

export const createActor = () => {
	const isDevelopment = process.env.NODE_ENV === 'development';

	return Actor.createActor<_SERVICE>(idlFactory, {
		agent: new HttpAgent({
			host: isDevelopment ? 'http://localhost:8000' : 'https://ic0.app',
			identity: getLocalStorageIdentity()
		}),
		canisterId: `${process.env.REACT_APP_CANISTER_ID}`
	});
};
