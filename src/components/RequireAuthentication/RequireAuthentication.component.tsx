import { PropsWithChildren, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthContext } from 'lib/context';

export const RequireAuthentication = ({ children }: PropsWithChildren) => {
	const { isAuthenticated } = useContext(AuthContext);
	const location = useLocation();

	return isAuthenticated ? (
		<>{children}</>
	) : (
		<Navigate to='/authenticate' replace state={{ path: location.pathname }} />
	);
};
