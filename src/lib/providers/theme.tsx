import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useContext } from 'react';

import { ColorModeContext } from 'lib/context';

export const ThemeProvider: React.FC = ({ children }) => {
	const { theme } = useContext(ColorModeContext);

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline enableColorScheme />
			{children}
		</MuiThemeProvider>
	);
};
