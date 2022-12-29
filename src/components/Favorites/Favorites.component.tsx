import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PreviewBackdrop } from 'components/Actions/Preview';
import { useDownload, useFavorites, usePreview, useUserAssets } from 'lib/hooks';
import { Asset, Doc } from 'lib/types';
import { getUrlPathToAsset } from 'lib/url';
import { Content, Main } from 'ui-components/Container';
import { Divider } from 'ui-components/Divider';
import { IconButton } from 'ui-components/IconButton';
import { AssetsList } from 'ui-components/List';
import { TableLoader } from 'ui-components/Loaders';
import { Snackbar } from 'ui-components/Snackbar';
import { PageTitle } from 'ui-components/Typography';

export const Favorites = () => {
	const navigate = useNavigate();
	const [docs, setDocs] = useState<Doc[]>([]);
	const [assetIdToPreview, setAssetIdToPreview] = useState(0);
	const [assetIdToDownload, setAssetIdToDownload] = useState(0);
	const [assetIdToFavorite, setAssetIdToFavorite] = useState(0);

	const { preview, isSuccess, reset } = usePreview();
	const { download } = useDownload();
	const { data: assets, isLoading: useAssetsIsLoading } = useUserAssets();
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

	const downloadPreviewChunks = async (asset: Asset) => {
		if (asset.type === 'folder') {
			return;
		}

		setAssetIdToPreview(asset.id);

		const docs = await preview([asset]);
		setDocs(docs);

		setAssetIdToPreview(0);
	};

	const isLoaded = !!assets && !useAssetsIsLoading;

	return (
		<>
			<Main>
				<Content>
					<PageTitle>Favorites</PageTitle>
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
									disabled: assetIdToPreview === asset.id,
									onClick:
										asset.type === 'folder'
											? () => navigate(`/${generateAssetPath(asset.id)}`)
											: () => downloadPreviewChunks(asset),
									secondaryAction: (
										<>
											<IconButton
												icon='favorite'
												label='Remove from favorites'
												loading={assetIdToFavorite === asset.id}
												onClick={async () => {
													setAssetIdToFavorite(asset.id);
													await handleOnFavoritesToggle(asset.id);
													setAssetIdToFavorite(0);
												}}
											/>
											<IconButton
												icon='download'
												label={
													asset.type === 'folder'
														? 'No support for folder downloads yet'
														: 'Download'
												}
												loading={assetIdToDownload === asset.id}
												disabled={asset.type === 'folder'}
												onClick={async () => {
													setAssetIdToDownload(asset.id);
													await download([asset]);
													setAssetIdToDownload(0);
												}}
											/>
										</>
									)
								}))}
							/>
						)}
					</>
				</Content>
				<Snackbar
					open={toggleFavoriteIsLoading}
					message={`${removeOrAdd === 'add' ? 'Adding asset to' : 'Removing asset from'} favorites`}
					loader
				/>
				<Snackbar
					open={toggleFavoriteIsSuccess}
					onClose={toggleFavoriteReset}
					message={`Asset is successfully ${removeOrAdd === 'add' ? 'added to' : 'removed from'} favorites`}
					onUndo={handleOnUndo}
				/>
			</Main>
			{isSuccess ? (
				<PreviewBackdrop
					open={isSuccess}
					onClick={() => {
						reset();
						setDocs([]);
					}}
					docs={docs}
				/>
			) : null}
		</>
	);
};
