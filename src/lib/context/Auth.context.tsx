import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { api } from 'api/index';
import { User } from 'declarations/users/users.did';
import { Snackbar } from 'ui-components/Snackbar';

interface ValidateSession {
	/**
	 * Callback to execute when session is still valid
	 */
	onSuccess: (authClient: AuthClient) => void;
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
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const init = async () => {
			await validateSession({
				onSuccess: async authClient => {
					try {
						await initAuthClient(authClient);

						const user = await api.User.getUser();
						setUser(user);

						setIsAuthenticated(true);
						setIsLoading(false);
						navigate((state as Record<string, string>)?.path ?? '/');
					} catch (error) {
						console.log('Validation Session Error', error);
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

		const authClient = await api.Actor.getAuthClient();
		await authClient.login({
			onSuccess: async () => {
				await initAuthClient(authClient);
				await initUser();

				setIsAuthenticated(true);
				setIsLoading(false);
				navigate((state as Record<string, string>)?.path ?? '/');
			},
			// 7 days
			maxTimeToLive: BigInt(Date.now() + 7 * 86400000),
			identityProvider: 'https://identity.ic0.app/#authorize'
		});
	};

	const initAuthClient = async (authClient: AuthClient) => {
		try {
			api.Actor.setAuthClient(authClient);
			const identity = authClient.getIdentity();
			setPrincipal(identity.getPrincipal());
		} catch (error) {
			console.log('Init AuthClient Error', error);
		}
	};

	const initUser = async () => {
		try {
			const user = await api.User.getUser();
			setUser(user);
		} catch (error) {
			console.log('Init User Error', error);

			try {
				const user = await api.User.createUser();
				setUser(user);
			} catch (error) {
				console.log('Create User Error', error);
				setErrorSnackarOpen(true);
			}
		}
	};

	const validateSession = async ({ onSuccess, onError }: ValidateSession) => {
		const authClient = await api.Actor.getAuthClient();
		const isAuthenticated = await authClient.isAuthenticated();

		if (!isAuthenticated) {
			return onError();
		}

		onSuccess(authClient);
	};

	return (
		<>
			<AuthContext.Provider
				value={{
					loginII,
					principal,
					isLoading,
					isAuthenticated,
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
