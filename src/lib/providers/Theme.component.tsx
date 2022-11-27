import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { PropsWithChildren, useContext } from 'react';

import { ColorModeContext } from 'lib/context';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const { theme } = useContext(ColorModeContext);

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline enableColorScheme />
			{children}
		</MuiThemeProvider>
	);
};
