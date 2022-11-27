import React, { PropsWithChildren } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';

import { AuthProvider, ColorModeProvider } from 'lib/context';
import { ReactQueryProvider } from './ReactQuery.component';
import { ThemeProvider } from './Theme.component';

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<ReactQueryProvider>
			<RecoilRoot>
				<AuthProvider>
					<ColorModeProvider>
						<ThemeProvider>
							<HelmetProvider>{children}</HelmetProvider>
						</ThemeProvider>
					</ColorModeProvider>
				</AuthProvider>
			</RecoilRoot>
		</ReactQueryProvider>
	);
};
