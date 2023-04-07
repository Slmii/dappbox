import Collapse from '@mui/material/Collapse';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useMemo, useState } from 'react';

import { Upload } from 'components/Upload';
import { UsedSpace } from 'components/UsedSpace';
import { DRAWER_WIDTH } from 'lib/constants/sizes.constants';
import { useUserAssets } from 'lib/hooks';
import { getUrlBreadcrumbs } from 'lib/url';
import { Icon } from 'ui-components/Icon';
import { Link } from 'ui-components/Link';
import { DrawerLoader } from 'ui-components/Loaders';

export const Drawer = () => {
	const { data: assets, isLoading } = useUserAssets();
	const [foldersOpen, setFoldersOpen] = useState(false);

	const folders = useMemo(() => {
		if (!assets) {
			return [];
		}

		return assets.filter(asset => asset.type === 'folder');
	}, [assets]);

	const handleClick = () => {
		setFoldersOpen(!foldersOpen);
	};

	const generateAssetPath = useMemo(
		() => (assetId: number) => {
			if (!assets) {
				return '';
			}

			return getUrlBreadcrumbs(assetId, assets);
		},
		[assets]
	);

	const isLoaded = !!assets && !isLoading;

	return (
		<MuiDrawer
			sx={{
				width: DRAWER_WIDTH,
				flexShrink: 0,
				'& > div': {
					backgroundColor: theme => (theme.palette.mode === 'dark' ? '#010101' : '#f1f1f1')
				},
				'& .MuiDrawer-paper': {
					width: DRAWER_WIDTH,
					boxSizing: 'border-box'
				}
			}}
			variant='permanent'
		>
			<Toolbar />
			{!isLoaded ? (
				<DrawerLoader />
			) : (
				<>
					<Upload />
					<List
						dense
						sx={{
							fontSize: theme => theme.typography.fontSize
						}}
					>
						<Link href='/'>
							<ListItemButton>
								<ListItemText disableTypography primary='Home' />
							</ListItemButton>
						</Link>
						<ListItemButton onClick={handleClick}>
							<ListItemText disableTypography primary='Folders' />
							<Icon icon={foldersOpen ? 'expandLess' : 'expandMore'} />
						</ListItemButton>
						{folders.length ? (
							<Collapse
								in={foldersOpen}
								timeout='auto'
								unmountOnExit
								sx={{
									maxHeight: 300,
									overflowY: 'auto'
								}}
							>
								<List
									dense
									component='div'
									sx={{
										backgroundColor: theme => theme.palette.background.default,
										borderTop: theme => `1px solid ${theme.palette.divider}`,
										borderBottom: theme => `1px solid ${theme.palette.divider}`,
										fontSize: 14
									}}
								>
									{folders.map(folder => (
										<Link key={folder.id} href={generateAssetPath(folder.id)}>
											<ListItem button sx={{ pl: 2 }}>
												<ListItemIcon>
													<Icon icon='folder' fontSize='small' color='info' />
												</ListItemIcon>
												<ListItemText
													disableTypography
													primary={folder.name}
													sx={{
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap',
														overflow: 'hidden'
													}}
												/>
											</ListItem>
										</Link>
									))}
								</List>
							</Collapse>
						) : null}
						<Link href='/favorites'>
							<ListItemButton>
								<ListItemText disableTypography primary='Favorites' />
							</ListItemButton>
						</Link>
						{/* <ListItemButton disabled>
							<ListItemText
								disableTypography
								primary={
									<>
										Shared
										<Chip
											size='small'
											label='Soon'
											sx={{
												marginLeft: SPACING
											}}
											color='secondary'
										/>
									</>
								}
							/>
						</ListItemButton>
						<ListItemButton disabled>
							<ListItemText
								disableTypography
								primary={
									<>
										NFT
										<Chip
											size='small'
											label='Soon'
											sx={{
												marginLeft: SPACING
											}}
											color='secondary'
										/>
									</>
								}
							/>
						</ListItemButton>
						<ListItemButton disabled>
							<ListItemText
								disableTypography
								primary={
									<>
										Buy canister
										<Chip
											size='small'
											label='Soon'
											sx={{
												marginLeft: SPACING
											}}
											color='secondary'
										/>
									</>
								}
							/>
						</ListItemButton> */}
					</List>
				</>
			)}
			<UsedSpace />
		</MuiDrawer>
	);
};
