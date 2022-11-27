import { Identity } from '@dfinity/agent';
import { AuthClient, LocalStorage } from '@dfinity/auth-client';
import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity';

export const loadIIAuthClient = () => {
	return AuthClient.create({
		storage: new LocalStorage(''),
		idleOptions: {
			disableDefaultIdleCallback: true,
			disableIdle: true
		}
	});
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
