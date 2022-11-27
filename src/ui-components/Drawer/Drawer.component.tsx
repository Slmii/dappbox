import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { useMemo, useState } from 'react';

import { constants } from 'lib/constants';
import { useUserAssets } from 'lib/hooks';
import { getUrlPathToAsset } from 'lib/url';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Icon } from 'ui-components/Icon';
import { Link } from 'ui-components/Link';
import { DrawerLoader } from 'ui-components/Loaders';

const Input = styled('input')({
	display: 'none'
});

export const Drawer = () => {
	const { data: assets, isLoading } = useUserAssets();
	const [foldersOpen, setFoldersOpen] = useState(false);

	const folders = useMemo(() => {
		if (!assets) {
			return [];
		}

		return assets.filter(asset => asset.assetType === 'folder');
	}, [assets]);

	const handleClick = () => {
		setFoldersOpen(!foldersOpen);
	};

	const generateAssetPath = useMemo(
		() => (assetId: number) => {
			if (!assets) {
				return '';
			}

			return getUrlPathToAsset(assetId, assets)
				.map(asset => encodeURIComponent(asset.assetId))
				.join('/');
		},
		[assets]
	);

	const isLoaded = !!assets && !isLoading;

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
			{!isLoaded ? (
				<DrawerLoader />
			) : (
				<>
					<Box sx={{ padding: constants.SPACING }}>
						<label htmlFor='upload-file'>
							<Input id='upload-file' multiple type='file' onChange={e => console.log(e.target.files)} />
							<Button
								startIcon='addOutlined'
								label='Upload'
								variant='contained'
								color='primary'
								size='large'
								fullWidth
								// @ts-ignore
								component='span'
								sx={{
									borderRadius: 50
								}}
							/>
						</label>
					</Box>
					<List
						dense
						sx={{
							fontSize: theme => theme.typography.fontSize
						}}
					>
						<Link href='/'>
							<ListItem button>
								<ListItemText disableTypography primary='Home' />
							</ListItem>
						</Link>
						<ListItem button onClick={handleClick}>
							<ListItemText disableTypography primary='Folders' />
							<Icon icon={foldersOpen ? 'expandLess' : 'expandMore'} />
						</ListItem>
						{folders.length ? (
							<Collapse in={foldersOpen} timeout='auto' unmountOnExit>
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
										<Link key={folder.assetId} href={generateAssetPath(folder.assetId)}>
											<ListItem button sx={{ pl: 2 }}>
												<ListItemIcon>
													<Icon icon='folder' fontSize='small' color='info' />
												</ListItemIcon>
												<ListItemText
													disableTypography
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
						<Link href='/favorites'>
							<ListItem button>
								<ListItemText disableTypography primary='Favorites' />
							</ListItem>
						</Link>
						<ListItem button disabled>
							<ListItemText
								disableTypography
								primary={
									<>
										NFTs
										<Chip
											size='small'
											label='Soon'
											sx={{
												marginLeft: constants.SPACING
											}}
											color='secondary'
										/>
									</>
								}
							/>
						</ListItem>
						<ListItem button disabled>
							<ListItemText
								disableTypography
								primary={
									<>
										Shared
										<Chip
											size='small'
											label='Soon'
											sx={{
												marginLeft: constants.SPACING
											}}
											color='secondary'
										/>
									</>
								}
							/>{' '}
						</ListItem>
					</List>
				</>
			)}
		</MuiDrawer>
	);
};
