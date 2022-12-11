import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { Error } from './Error.component';

export const ErrorBoundary = ({ children }: PropsWithChildren) => {
	const { reset } = useQueryErrorResetBoundary();

	return (
		<ReactErrorBoundary
			fallbackRender={({ resetErrorBoundary, error }) => <Error error={error} reset={resetErrorBoundary} />}
			onReset={reset}
		>
			{children}
		</ReactErrorBoundary>
	);
};
