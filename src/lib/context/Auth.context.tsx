import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { Actor } from 'api/actor';
import { api } from 'api/index';
import { mapToUserInterface } from 'api/users';
import { _SERVICE } from 'declarations/users/users.did';
import { activitiesAtom } from 'lib/recoil';
import { User } from 'lib/types';
import { unwrap } from 'lib/utils/unwrap.utils';
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
	loginII: () => Promise<void>;
	/**
	 * Sign Out with II
	 */
	logOut: () => Promise<void>;
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
	loginII: () => Promise.resolve(),
	logOut: () => Promise.resolve(),
	principal: undefined,
	isLoading: false,
	isAuthenticated: false,
	user: undefined
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { state } = useLocation();
	const setActivities = useSetRecoilState(activitiesAtom);

	const [errorSnackbarOpen, setErrorSnackarOpen] = useState(false);
	const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState<User | undefined>(undefined);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const init = async () => {
			setIsLoading(true);

			await validateSession({
				onSuccess: async authClient => {
					const actor = await Actor.getActor<_SERVICE>('users');

					try {
						await initAuthClient(authClient);

						const response = await actor.get_user();
						const user = await unwrap(response);
						setUser(mapToUserInterface(user));

						setIsAuthenticated(true);
						setIsLoading(false);
						navigate((state as Record<string, string>)?.path ?? '/');
					} catch (error) {
						setIsLoading(false);
						navigate('/authenticate');
					}
				},
				onError: () => {
					setIsLoading(false);
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
				const isSuccess = await initUser();

				if (!isSuccess) {
					await logOut();
					return;
				}

				setIsAuthenticated(true);
				navigate((state as Record<string, string>)?.path ?? '/');
			},
			onError: async error => {
				console.error('Failed to II Login', error);

				await logOut();
				navigate('/authenticate');
			},
			// 7 days
			// maxTimeToLive: BigInt(Date.now() + 7 * 86400000),
			identityProvider: 'https://identity.ic0.app/#authorize'
		});
	};

	const initAuthClient = async (authClient: AuthClient) => {
		api.Actor.setAuthClient(authClient);
		setPrincipal(authClient.getIdentity().getPrincipal());
	};

	const initUser = async () => {
		const actor = await Actor.getActor<_SERVICE>('users');

		try {
			const response = await actor.get_user();
			const user = await unwrap(response);
			setUser(mapToUserInterface(user));

			return true;
		} catch (error) {
			try {
				await actor.create_user([]);

				const response = await actor.get_user();
				const user = await unwrap(response);

				setUser(mapToUserInterface(user));

				return true;
			} catch (error) {
				console.log('Init user Error', { error });
				setErrorSnackarOpen(true);

				return false;
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

	const logOut = async () => {
		setPrincipal(undefined);
		setIsLoading(false);
		setUser(undefined);
		setIsAuthenticated(false);
		setActivities({
			open: false,
			id: 0,
			activities: []
		});

		const authClient = await api.Actor.getAuthClient();
		await authClient.logout();

		await queryClient.resetQueries();
		await queryClient.invalidateQueries();
	};

	return (
		<>
			<AuthContext.Provider
				value={{
					loginII,
					logOut,
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
