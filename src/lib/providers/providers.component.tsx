import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';

import { AuthProvider, ColorModeProvider } from 'lib/context';
import { ThemeProvider } from './theme';

export const Providers: React.FC = ({ children }) => {
	return (
		<AuthProvider>
			<RecoilRoot>
				<ColorModeProvider>
					<ThemeProvider>
						<HelmetProvider>{children}</HelmetProvider>
					</ThemeProvider>
				</ColorModeProvider>
			</RecoilRoot>
		</AuthProvider>
	);
};
