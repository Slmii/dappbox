import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';

import { AuthProvider, ColorModeProvider } from 'lib/context';
import { ThemeProvider } from './theme';

export const Providers: React.FC = ({ children }) => {
	return (
		<AuthProvider>
			<ColorModeProvider>
				<ThemeProvider>
					<RecoilRoot>
						<HelmetProvider>{children}</HelmetProvider>
					</RecoilRoot>
				</ThemeProvider>
			</ColorModeProvider>
		</AuthProvider>
	);
};
