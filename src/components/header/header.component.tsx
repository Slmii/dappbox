import { Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useContext, useState } from 'react';

import { AuthContext, ColorModeContext } from 'lib/context';
import { Appbar } from 'ui-components/app-bar';
import { Box } from 'ui-components/box';
import { Button } from 'ui-components/button';
import { IconButton } from 'ui-components/icon-button';
import { Snackbar } from 'ui-components/snackbar';

export const Header = () => {
	const theme = useTheme();
	const { toggleColorMode } = useContext(ColorModeContext);
	const { isConnected, principal } = useContext(AuthContext);
	const [isAddressCopied, setIsAddressCopied] = useState(false);

	const renderPrincipalId = () => {
		if (principal) {
			const principalId = principal.toText();
			const first = principalId.split('-')[0];
			const last = principalId.split('-').pop();

			return `${first}...${last}`;
		}

		return 'Authenticate';
	};

	const handleOnAddressCopy = () => {
		navigator.clipboard.writeText(principal?.toText() ?? '');
		setIsAddressCopied(true);
	};

	const colorMode = theme.palette.mode;

	return (
		<Appbar>
			<Box sx={{ flexGrow: 1 }}>LOGO</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					'& > *:not(:last-child)': {
						marginRight: 1
					}
				}}
			>
				<IconButton
					icon={colorMode === 'dark' ? 'lightMode' : 'darkMode'}
					label={colorMode === 'dark' ? 'Lights on' : 'Lights off'}
					onClick={toggleColorMode}
				/>
				<>
					{isConnected ? (
						<Tooltip arrow title='Copy address'>
							<Button label={renderPrincipalId()} onClick={handleOnAddressCopy} />
						</Tooltip>
					) : null}
				</>
			</Box>
			<Snackbar open={isAddressCopied} message='Copied' onClose={() => setIsAddressCopied(false)} />
		</Appbar>
	);
};
