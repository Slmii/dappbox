import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import Collapse from '@mui/material/Collapse';
import MuiDrawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { constants } from 'lib/constants';
import { assetsAtom } from 'lib/recoil';
import { Box } from 'ui-components/box';
import { Icon } from 'ui-components/icon';
import { Link } from 'ui-components/link';
import { DrawerLoader } from 'ui-components/loaders';

export const Drawer = () => {
	const { isLoading } = useRecoilValue(assetsAtom);
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<MuiDrawer
			sx={{
				width: constants.DRAWER_WIDTH,
				flexShrink: 0,
				'& > div': {
					backgroundColor: theme => (theme.palette.mode === 'dark' ? '#010101' : '#f1f1f1')
				},
				[`& .MuiDrawer-paper`]: {
					width: 240,
					boxSizing: 'border-box'
				}
			}}
			variant='permanent'
		>
			<Toolbar />
			{isLoading ? (
				<DrawerLoader />
			) : (
				<>
					<Box sx={{ padding: 1 }}>
						<Fab variant='extended' color='primary' sx={{ width: '100%' }}>
							<Icon icon='addOutlined' spacingRight />
							Upload
						</Fab>
					</Box>
					<List>
						<Link href='/'>
							<ListItem button>
								<ListItemText primary='Home' />
							</ListItem>
						</Link>
						<ListItem button onClick={handleClick}>
							<ListItemText primary='Folders' />
							{open ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={open} timeout='auto' unmountOnExit>
							<List
								dense
								component='div'
								sx={{
									backgroundColor: theme => theme.palette.background.default,
									borderTop: theme => `1px solid ${theme.palette.divider}`,
									borderBottom: theme => `1px solid ${theme.palette.divider}`
								}}
							>
								<ListItem button sx={{ pl: 2 }}>
									<ListItemIcon>
										<FolderIcon fontSize='small' color='info' />
									</ListItemIcon>
									<ListItemText primary='Folder A' />
								</ListItem>
								<ListItem button sx={{ pl: 2 }}>
									<ListItemIcon>
										<FolderIcon fontSize='small' color='info' />
									</ListItemIcon>
									<ListItemText primary='Folder B' />
								</ListItem>
							</List>
						</Collapse>
						<ListItem button>
							<ListItemText primary='NFTs' />
						</ListItem>
						<Link href='/favorites'>
							<ListItem button>
								<ListItemText primary='Favorites' />
							</ListItem>
						</Link>
						{/* <ListItem button>
					<ListItemText primary='Shared' />
				</ListItem> */}
					</List>
				</>
			)}
		</MuiDrawer>
	);
};
