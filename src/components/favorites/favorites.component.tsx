import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { useFavorites } from 'lib/hooks';
import { assetsAtom } from 'lib/recoil';
import { getUrlPathToAsset } from 'lib/url';
import { Box } from 'ui-components/box';
import { Content, Main } from 'ui-components/container';
import { Divider } from 'ui-components/divider';
import { Icon } from 'ui-components/icon';
import { IconButton } from 'ui-components/icon-button';
import { Link } from 'ui-components/link';
import { TableLoader } from 'ui-components/loaders';
import { Snackbar } from 'ui-components/snackbar';
import { Body, PageTitle } from 'ui-components/typography';

export const Favorites = () => {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const { assets, isLoading } = useRecoilValue(assetsAtom);
	const { handleOnToggleFavorites, handleOnUndo } = useFavorites();

	const favoriteAssets = useMemo(() => {
		return assets.filter(asset => asset.isFavorite);
	}, [assets]);

	const generateAssetPath = useMemo(
		() => (assetId: number) => {
			return getUrlPathToAsset(assetId, assets)
				.map(asset => encodeURIComponent(asset.assetId))
				.join('/');
		},

		[assets]
	);

	return (
		<Main>
			<Content>
				<PageTitle title='Favorites' />
			</Content>
			<Divider />
			<>
				{isLoading ? (
					<TableLoader />
				) : (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						{favoriteAssets.map(asset => {
							const render = (
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										'&: hover': {
											backgroundColor: 'action.hover'
										},
										padding: '6px 16px',
										borderBottom: 1,
										borderColor: 'divider'
									}}
								>
									<Icon
										icon={asset.assetType === 'folder' ? 'folder' : 'download'}
										color='info'
										spacingRight
									/>
									<Body title={asset.name} />
									<Box
										sx={{
											marginLeft: 'auto'
										}}
									>
										<IconButton
											icon='delete'
											label='Remove from favorites'
											onClick={e => {
												e.preventDefault();
												e.stopPropagation();

												handleOnToggleFavorites(asset.assetId, false);
												setSnackbarOpen(true);
											}}
										/>
									</Box>
								</Box>
							);

							return (
								<>
									{asset.assetType === 'folder' ? (
										<Link key={asset.assetId} href={`/${generateAssetPath(asset.assetId)}`}>
											{render}
										</Link>
									) : (
										<Box
											sx={{
												cursor: 'pointer'
											}}
											onClick={e => {
												alert('preview');
											}}
										>
											{render}
										</Box>
									)}
								</>
							);
						})}
					</Box>
				)}
			</>
			<Snackbar
				open={snackbarOpen}
				onClose={() => setSnackbarOpen(false)}
				message='Asset is removed from favorites'
				onUndo={handleOnUndo}
			/>
		</Main>
	);
};
