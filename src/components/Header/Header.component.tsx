import { useTheme } from '@mui/material/styles';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SPACING } from 'lib/constants/spacing.constants';
import { AuthContext, ColorModeContext } from 'lib/context';
import { Appbar } from 'ui-components/AppBar';
import { Box, Column } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { IconButton } from 'ui-components/IconButton';
import { Link } from 'ui-components/Link';
import { Menu } from 'ui-components/Menu';
import { Snackbar } from 'ui-components/Snackbar';

export const Header = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { toggleColorMode } = useContext(ColorModeContext);
	const { isAuthenticated, principal, logOut } = useContext(AuthContext);
	const [isAddressCopied, setIsAddressCopied] = useState(false);
	const [isLogOutLoading, setIsLogOutLoading] = useState(false);

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
			<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
				<Link href='/'>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<img src='/assets/dappbox.png' alt='DappBox' height={40} width={40} />
						<Box sx={{ ml: SPACING / 2 }}>DappBox</Box>
					</Box>
				</Link>
			</Box>
			<Column>
				{isAuthenticated ? (
					<Button
						label={renderPrincipalId.toUpperCase()}
						onClick={handleOnAddressCopy}
						tooltip='Copy principal'
					/>
				) : null}
				<IconButton
					icon={colorMode === 'dark' ? 'lightMode' : 'darkMode'}
					label={colorMode === 'dark' ? 'Lights on' : 'Lights off'}
					onClick={toggleColorMode}
				/>
				{isAuthenticated ? (
					<Menu
						label={<IconButton icon='menu' label='Menu' loading={isLogOutLoading} />}
						id='profile'
						menu={[
							// {
							// 	label: 'Profile',
							// 	icon: 'profile',
							// 	action: () => setProfileOpen(true)
							// },
							{
								label: 'Bug/Feedback',
								action: () =>
									window.open(
										'https://docs.google.com/forms/d/e/1FAIpQLScPkNcDnT7EWlAeGgNcj6hzis4dpvZU-dr8gDgdIJiegpaTuA/viewform?usp=sf_link',
										'_blank'
									),
								icon: 'feedback'
							},
							{
								label: 'Log out',
								icon: 'logOut',
								action: async () => {
									setIsLogOutLoading(true);
									await logOut();
									setIsLogOutLoading(false);

									navigate('/authenticate');
								}
							}
						]}
					/>
				) : null}
			</Column>
			<Snackbar open={isAddressCopied} message='Copied' onClose={() => setIsAddressCopied(false)} />
		</Appbar>
	);
};
