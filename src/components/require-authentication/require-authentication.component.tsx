import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from 'lib/context';

export const RequireAuthentication: React.FC = ({ children }) => {
	const { isAuthenticated } = useContext(AuthContext);

	return isAuthenticated ? <>{children}</> : <Navigate to='/authenticate' replace />;
};
