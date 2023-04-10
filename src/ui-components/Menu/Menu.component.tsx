import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';

import { icons } from 'ui-components/icons';
import { MenuProps } from './Menu.types';

export const Menu = ({ label, id, menu, fullWidth }: MenuProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleOnMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};

	const handleOnMenuClose = (action?: () => void) => {
		action?.();
		setAnchorEl(null);
	};

	return (
		<>
			{React.cloneElement(label, { onClick: menu ? handleOnMenuOpen : undefined })}
			<MuiMenu
				id={`${id}-menu`}
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={() => handleOnMenuClose()}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left'
				}}
				PaperProps={
					fullWidth
						? {
								style: {
									width: anchorEl?.getBoundingClientRect().width ?? undefined
								}
						  }
						: undefined
				}
			>
				{menu.map(({ label, icon, image, href, action, disabled }) => {
					const IconComponent = icons[icon as keyof typeof icons];

					return (
						<MenuItem key={label} onClick={() => handleOnMenuClose(action)} disabled={disabled}>
							{icon ? (
								<ListItemIcon>
									<IconComponent fontSize='small' />
								</ListItemIcon>
							) : null}
							<ListItemText>{label}</ListItemText>
						</MenuItem>
					);
				})}
			</MuiMenu>
		</>
	);
};

export default Menu;
