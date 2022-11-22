import AppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { PropsWithChildren } from 'react';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export const Appbar = ({ children }: PropsWithChildren) => {
	return (
		<>
			<AppBar
				position='fixed'
				sx={{
					backgroundColor: theme =>
						theme.palette.mode === 'light' ? 'white' : theme.palette.background.default,
					color: 'text.primary',
					zIndex: theme => theme.zIndex.drawer + 1,
					boxShadow: 'none',
					borderBottom: '1px solid',
					borderColor: 'divider'
				}}
			>
				<Toolbar
					disableGutters
					sx={{
						paddingLeft: 2,
						paddingRight: 2
					}}
				>
					{children}
				</Toolbar>
			</AppBar>
			<Offset />
		</>
	);
};
