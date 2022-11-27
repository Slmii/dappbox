import { useTheme } from '@mui/material/styles';
import { useCallback, useContext, useMemo, useState } from 'react';

import { AuthContext, ColorModeContext } from 'lib/context';
import { useInitAssets } from 'lib/hooks';
import { Appbar } from 'ui-components/AppBar';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { IconButton } from 'ui-components/IconButton';
import { Link } from 'ui-components/Link';
import { Snackbar } from 'ui-components/Snackbar';

export const Header = () => {
	const theme = useTheme();
	const { toggleColorMode } = useContext(ColorModeContext);
	const { isAuthenticated, principal, signOut } = useContext(AuthContext);
	const [isAddressCopied, setIsAddressCopied] = useState(false);

	useInitAssets();

	const renderPrincipalId = useMemo(() => {
		if (principal) {
			const principalId = principal.toText();
			const first = principalId.split('-')[0];
			const last = principalId.split('-').pop();

			return `${first}...${last}`;
		}

		return 'Authenticate';
	}, [principal]);

	const handleOnAddressCopy = useCallback(() => {
		navigator.clipboard.writeText(principal?.toText() ?? '');
		setIsAddressCopied(true);
	}, [principal]);

	const colorMode = theme.palette.mode;

	return (
		<Appbar>
			<Box sx={{ flexGrow: 1 }}>{isAuthenticated ? <Link href='/'>LOGO</Link> : 'LOGO'}</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					'& > *:not(:last-child)': {
						marginRight: 1
					}
				}}
			>
				<>
					{isAuthenticated ? (
						<Button label={renderPrincipalId} onClick={handleOnAddressCopy} tooltip='Copy principal' />
					) : null}
				</>
				<IconButton
					icon={colorMode === 'dark' ? 'lightMode' : 'darkMode'}
					label={colorMode === 'dark' ? 'Lights on' : 'Lights off'}
					onClick={toggleColorMode}
				/>
				{isAuthenticated ? <IconButton icon='signOUt' label='Sign out' onClick={signOut} /> : null}
			</Box>
			<Snackbar open={isAddressCopied} message='Copied' onClose={() => setIsAddressCopied(false)} />
		</Appbar>
	);
};
