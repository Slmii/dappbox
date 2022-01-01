import { Principal } from '@dfinity/principal';
import { createContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { idlFactory } from 'lib/generated/dappbox_idl';
import { _SERVICE } from 'lib/generated/dappbox_types';

const isDevelopment = process.env.NODE_ENV === 'development';

interface IAuthClient {
	/**
	 * Authenticate with Plug Wallet
	 */
	loginPlug: () => void;
	/**
	 * Actor
	 */
	actor?: _SERVICE;
	/**
	 * If connected to Plug Wallet
	 */
	isConnected: boolean;
	/**
	 * Principal
	 */
	principal?: Principal;
	/**
	 * Is authentication in loading state
	 */
	isLoading: boolean;
	/**
	 * Is connected to plug and principal is available
	 * then we're authenticated
	 */
	isAuthenticated: boolean;
}

export const AuthContext = createContext<IAuthClient>({
	loginPlug: () => {},
	actor: undefined,
	isConnected: false,
	principal: undefined,
	isLoading: false,
	isAuthenticated: false
});

export const AuthProvider: React.FC = ({ children }) => {
	const navigate = useNavigate();

	const [isConnected, setIsConnected] = useState(false);
	const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [actor, setActor] = useState<_SERVICE | undefined>(undefined);

	const { canisterId, currentWindow, host, isPlugWalletInstalled, whitelist } = useMemo(() => {
		return {
			currentWindow: window as any,
			canisterId: process.env.REACT_APP_CANISTER_ID,
			whitelist: [process.env.REACT_APP_CANISTER_ID],
			host: isDevelopment ? 'http://localhost:8000' : 'https://mainnet.dfinity.network',
			isPlugWalletInstalled: !!(window as any).ic.plug
		};
	}, []);

	const loginPlug = async () => {
		if (!isPlugWalletInstalled) {
			return;
		}

		setIsLoading(true);

		try {
			await currentWindow.ic.plug.requestConnect({
				whitelist,
				host
			});

			const connected = (await currentWindow.ic.plug.isConnected()) as boolean;
			if (connected) {
				setIsConnected(true);

				// Get the user principal
				const principal = (await currentWindow.ic.plug.agent.getPrincipal()) as Principal;
				setPrincipal(principal);

				if (isDevelopment) {
					await currentWindow.ic.plug.agent.fetchRootKey();
				}

				const actor: _SERVICE = await currentWindow.ic.plug.createActor({
					canisterId,
					interfaceFactory: idlFactory
				});
				setActor(actor);

				setIsLoading(false);

				navigate('/');
			}
		} catch (error) {
			console.log({ error });
			setIsLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				loginPlug,
				principal,
				isLoading,
				isConnected,
				actor,
				isAuthenticated: isConnected && !!principal
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
