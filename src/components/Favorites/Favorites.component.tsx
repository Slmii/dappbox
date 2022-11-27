import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { useFavorites } from 'lib/hooks';
import { assetsAtom } from 'lib/recoil';
import { getUrlPathToAsset } from 'lib/url';
import { Content, Main } from 'ui-components/Container';
import { Divider } from 'ui-components/Divider';
import { AssetsList } from 'ui-components/List';
import { TableLoader } from 'ui-components/Loaders';
import { Snackbar } from 'ui-components/Snackbar';
import { PageTitle } from 'ui-components/Typography';

export const Favorites = () => {
	const navigate = useNavigate();
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const { assets, isLoading } = useRecoilValue(assetsAtom);
	const { handleOnFavoritesToggle, handleOnUndo } = useFavorites();

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

	const handleOnRemoveFavorite = (assetId: number) => {
		handleOnFavoritesToggle(assetId);
		setSnackbarOpen(true);
	};

	return (
		<Main>
			<Content>
				<PageTitle title='Favorites' />
			</Content>
			<Divider />
			<Content>
				<>
					{isLoading ? (
						<TableLoader />
					) : (
						<AssetsList
							assets={favoriteAssets.map(asset => ({
								assetId: asset.assetId,
								name: asset.name,
								icon: asset.assetType === 'folder' ? 'folder' : 'download',
								onClick:
									asset.assetType === 'folder'
										? () => navigate(`/${generateAssetPath(asset.assetId)}`)
										: () => alert('TODO: preview'),
								secondaryAction: {
									icon: 'favorite',
									label: 'Remove from favorites',
									onClick: handleOnRemoveFavorite
								}
							}))}
						/>
					)}
				</>
			</Content>
			<Snackbar
				open={snackbarOpen}
				onClose={() => setSnackbarOpen(false)}
				message='Asset is removed from favorites'
				onUndo={handleOnUndo}
			/>
		</Main>
	);
};
