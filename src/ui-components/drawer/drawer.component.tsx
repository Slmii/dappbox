import Collapse from '@mui/material/Collapse';
import MuiDrawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { constants } from 'lib/constants';
import { assetsAtom } from 'lib/recoil';
import { getUrlPathToAsset } from 'lib/url';
import { Box } from 'ui-components/box';
import { Icon } from 'ui-components/icon';
import { Link } from 'ui-components/link';
import { DrawerLoader } from 'ui-components/loaders';

export const Drawer = () => {
	const { assets, isLoading } = useRecoilValue(assetsAtom);
	const [open, setOpen] = useState(false);

	const folderAssets = useMemo(() => {
		return assets.filter(asset => asset.assetType === 'folder');
	}, [assets]);

	const handleClick = () => {
		setOpen(!open);
	};

	const generateAssetPath = useMemo(
		() => (assetId: number) => {
			return getUrlPathToAsset(assetId, assets)
				.map(asset => encodeURIComponent(asset.assetId))
				.join('/');
		},
		[assets]
	);

	return (
		<MuiDrawer
			sx={{
				width: constants.DRAWER_WIDTH,
				flexShrink: 0,
				'& > div': {
					backgroundColor: theme => (theme.palette.mode === 'dark' ? '#010101' : '#f1f1f1')
				},
				[`& .MuiDrawer-paper`]: {
					width: constants.DRAWER_WIDTH,
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
							<Icon icon={open ? 'expandLess' : 'expandMore'} />
						</ListItem>
						{folderAssets.length ? (
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
									{folderAssets.map(folder => (
										<Link key={folder.assetId} href={generateAssetPath(folder.assetId)}>
											<ListItem button sx={{ pl: 2 }}>
												<ListItemIcon>
													<Icon icon='folder' fontSize='small' color='info' />
												</ListItemIcon>
												<ListItemText
													primary={folder.name}
													sx={{
														'& > span': {
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
															overflow: 'hidden'
														}
													}}
												/>
											</ListItem>
										</Link>
									))}
								</List>
							</Collapse>
						) : null}
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
