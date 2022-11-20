import { Principal } from '@dfinity/principal';
import { createContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Actor } from 'api/actor';
import { api } from 'api/index';
import { canisterId } from 'declarations/dappbox';
import { User } from 'declarations/dappbox/dappbox.did';
import { loadIIAuthClient } from 'lib/auth';
import { Snackbar } from 'ui-components/snackbar';

interface IAuthClient {
	/**
	 * Authenticate with II
	 */
	loginII: () => void;
	initUser: () => Promise<void>;
	/**
	 * Principal
	 */
	principal?: Principal;
	/**
	 * Is authentication in loading state
	 */
	isLoading: boolean;
	/**
	 * Is principal is available then we're authenticated
	 */
	isAuthenticated: boolean;
	user?: User;
}

export const AuthContext = createContext<IAuthClient>({
	loginII: () => {},
	initUser: () => Promise.resolve(),
	principal: undefined,
	isLoading: false,
	isAuthenticated: false,
	user: undefined
});

export const AuthProvider: React.FC = ({ children }) => {
	const navigate = useNavigate();
	const { state } = useLocation();

	const [errorSnackbarOpen, setErrorSnackarOpen] = useState(false);
	const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState<User | undefined>(undefined);

	const loginII = async () => {
		setIsLoading(true);

		const authClient = await loadIIAuthClient();
		await authClient.login({
			onSuccess: async () => {
				Actor.setAuthClient(authClient);

				const identity = authClient.getIdentity();
				setPrincipal(identity.getPrincipal());

				const actor = await Actor.getActor();
				Actor.setActor(actor);

				await initUser();

				navigate((state as Record<string, string>)?.path ?? '/');
			},
			// 7 days
			maxTimeToLive: BigInt(Date.now() + 7 * 86400000),
			identityProvider: `http://127.0.0.1:8000/?canisterId=${canisterId}` // ? : 'https://identity.ic0.app/#authorize'
		});
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

	return (
		<>
			<AuthContext.Provider
				value={{
					loginII,
					principal,
					isLoading,
					isAuthenticated: !!user,
					initUser,
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
