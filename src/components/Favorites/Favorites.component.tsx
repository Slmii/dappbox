import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFavorites, useUserAssets } from 'lib/hooks';
import { getUrlPathToAsset } from 'lib/url';
import { Content, Main } from 'ui-components/Container';
import { Divider } from 'ui-components/Divider';
import { AssetsList } from 'ui-components/List';
import { TableLoader } from 'ui-components/Loaders';
import { Snackbar } from 'ui-components/Snackbar';
import { PageTitle } from 'ui-components/Typography';

export const Favorites = () => {
	const navigate = useNavigate();

	const { data: assets, isLoading } = useUserAssets();
	const {
		handleOnFavoritesToggle,
		handleOnUndo,
		isSuccess: toggleFavoriteIsSuccess,
		reset: toggleFavoriteReset,
		isLoading: toggleFavoriteIsLoading,
		removeOrAdd
	} = useFavorites();

	const favoriteAssets = useMemo(() => {
		if (!assets) {
			return [];
		}

		return assets.filter(asset => asset.isFavorite);
	}, [assets]);

	const generateAssetPath = useMemo(
		() => (assetId: number) => {
			if (!assets) {
				return '';
			}

			return getUrlPathToAsset(assetId, assets)
				.map(asset => encodeURIComponent(asset.id))
				.join('/');
		},

		[assets]
	);

	const isLoaded = !!assets && !isLoading;

	return (
		<Main>
			<Content>
				<PageTitle title='Favorites' />
			</Content>
			<Divider />
			<Content>
				<>
					{!isLoaded ? (
						<TableLoader />
					) : (
						<AssetsList
							assets={favoriteAssets.map(asset => ({
								id: asset.id,
								name: asset.name,
								icon: asset.type === 'folder' ? 'folder' : 'download',
								onClick:
									asset.type === 'folder'
										? () => navigate(`/${generateAssetPath(asset.id)}`)
										: () => alert('TODO: preview'),
								secondaryAction: {
									icon: 'favorite',
									label: 'Remove from favorites',
									onClick: handleOnFavoritesToggle
								}
							}))}
						/>
					)}
				</>
			</Content>
			<Snackbar
				open={toggleFavoriteIsLoading}
				message={`${removeOrAdd === 'add' ? 'Adding assed to' : 'Removing asset from'} favorites`}
				loader
			/>
			<Snackbar
				open={toggleFavoriteIsSuccess}
				onClose={toggleFavoriteReset}
				message={`Asset is successfully ${removeOrAdd === 'add' ? 'added to' : 'removed from'} favorites`}
				onUndo={handleOnUndo}
			/>
		</Main>
	);
};
