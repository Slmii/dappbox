import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';
import React, { PropsWithChildren } from 'react';

import { useLocalStorage } from 'lib/hooks';

interface ColorModeContextInterface {
	theme: Theme;
	toggleColorMode: () => void;
}

export const ColorModeContext = React.createContext<ColorModeContextInterface>({
	theme: {} as Theme,
	toggleColorMode: () => {}
});

type ColorMode = 'light' | 'dark';

export const ColorModeProvider = ({ children }: PropsWithChildren) => {
	const [mode, setMode] = useLocalStorage<ColorMode>('colorMode', 'light');

	const { toggleColorMode } = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode(mode === 'light' ? 'dark' : 'light');
			}
		}),

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[mode]
	);

	const colorModeTheme = React.useMemo(() => {
		let theme = createTheme({
			palette: {
				mode,
				...(mode === 'light'
					? {
							// palette values for light mode
							primary: {
								main: '#4A9C7F'
							},
							secondary: {
								main: '#d6ad10'
							}
					  }
					: {
							// palette values for dark mode
							primary: {
								main: '#92cfbc'
							},
							secondary: {
								main: '#e9ea94'
							}
					  })
			},
			typography: {
				fontFamily: '"Roboto", serif',
				fontSize: 16,
				htmlFontSize: 16
			},
			shape: {
				borderRadius: 4
			},
			spacing: 16
		});

		theme = responsiveFontSizes(theme);

		return theme;
	}, [mode]);

	return (
		<ColorModeContext.Provider
			value={{
				theme: colorModeTheme,
				toggleColorMode
			}}
		>
			{children}
		</ColorModeContext.Provider>
	);
};
