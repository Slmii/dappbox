import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Actor } from 'api/actor';
import { api } from 'api/index';
import { User } from 'declarations/dappbox/dappbox.did';
import { getLocalStorageIdentity, loadIIAuthClient } from 'lib/auth';
import { Snackbar } from 'ui-components/Snackbar';

interface ValidateSession {
	/**
	 * Callback to execute when session is still valid
	 */
	onSuccess: (identity: Identity) => void;
	/**
	 * Callback to execute when session is not valid
	 */
	onError: () => void;
}

interface IAuthClient {
	/**
	 * Authenticate with II
	 */
	loginII: () => void;
	/**
	 * Validate session on load
	 */
	validateSession: (props: ValidateSession) => Promise<void>;
	/**
	 * Principal
	 */
	principal?: Principal;
	/**
	 * Is authentication in loading state
	 */
	isLoading: boolean;
	/**
	 * If authenticated
	 */
	isAuthenticated: boolean;
	user?: User;
}

export const AuthContext = createContext<IAuthClient>({
	loginII: () => {},
	validateSession: () => Promise.resolve(),
	principal: undefined,
	isLoading: false,
	isAuthenticated: false,
	user: undefined
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const navigate = useNavigate();
	const { state } = useLocation();

	const [errorSnackbarOpen, setErrorSnackarOpen] = useState(false);
	const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState<User | undefined>(undefined);

	useEffect(() => {
		const init = async () => {
			await validateSession({
				onSuccess: async () => {
					try {
						const user = await api.User.getUser();
						setUser(user);

						setIsLoading(false);
					} catch (error) {
						navigate('/authenticate');
					}
				},
				onError: () => {
					navigate('/authenticate');
				}
			});
		};

		init();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const loginII = async () => {
		setIsLoading(true);

		const authClient = await loadIIAuthClient();
		await authClient.login({
			onSuccess: async () => {
				await initAuthClient(authClient);
				await initUser();

				navigate((state as Record<string, string>)?.path ?? '/');
			},
			// 7 days
			maxTimeToLive: BigInt(Date.now() + 7 * 86400000),
			identityProvider: 'https://identity.ic0.app/#authorize'
		});
	};

	const initAuthClient = async (authClient: AuthClient) => {
		Actor.setAuthClient(authClient);

		const identity = authClient.getIdentity();
		setPrincipal(identity.getPrincipal());

		const actor = await Actor.getActor();
		Actor.setActor(actor);
	};

	const initUser = async () => {
		try {
			const user = await api.User.getUser();
			setUser(user);
		} catch (error) {
			try {
				const user = await api.User.createUser();
				setUser(user);
			} catch (error) {
				setErrorSnackarOpen(true);
			}
		}
	};

	const validateSession = async ({ onSuccess, onError }: ValidateSession) => {
		const identity = await getLocalStorageIdentity();
		if (!identity) {
			return onError();
		}

		const authClient = await loadIIAuthClient();
		await initAuthClient(authClient);

		onSuccess(authClient.getIdentity());
	};

	return (
		<>
			<AuthContext.Provider
				value={{
					loginII,
					principal,
					isLoading,
					isAuthenticated: !!user,
					validateSession,
					user
				}}
			>
				{children}
			</AuthContext.Provider>
			<Snackbar
				open={errorSnackbarOpen}
				message='Oops, something went wrong...'
				onClose={() => {
					setErrorSnackarOpen(false);
					setIsLoading(false);
				}}
				persist
			/>
		</>
	);
};
