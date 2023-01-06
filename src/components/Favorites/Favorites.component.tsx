import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PreviewBackdrop } from 'components/Actions/Preview';
import { useDownload, useFavorites, usePreview, useUserAssets } from 'lib/hooks';
import { Asset, Doc } from 'lib/types';
import { getUrlBreadcrumbs } from 'lib/url';
import { Content, FavoritesContainer, Main } from 'ui-components/Container';
import { Divider } from 'ui-components/Divider';
import { IconButton } from 'ui-components/IconButton';
import { AssetsList } from 'ui-components/List';
import { TableLoader } from 'ui-components/Loaders';
import { PageTitle } from 'ui-components/Typography';

export const Favorites = () => {
	const navigate = useNavigate();
	const [docs, setDocs] = useState<Doc[]>([]);
	const [assetIdToPreview, setAssetIdToPreview] = useState(0);
	const [assetIdToDownload, setAssetIdToDownload] = useState(0);
	const [assetIdsToFavorite, setAssetIdsToFavorite] = useState<number[]>([]);

	const { preview, isSuccess: previewIsSuccess, reset: previewReset } = usePreview();
	const { download } = useDownload();
	const { data: assets, isLoading: useAssetsIsLoading } = useUserAssets();
	const { handleOnFavoritesToggle } = useFavorites();

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

			return getUrlBreadcrumbs(assetId, assets);
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
				<FavoritesContainer>
					<Content>
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
												loading={assetIdsToFavorite.includes(asset.id)}
												onClick={async () => {
													setAssetIdsToFavorite(prevState => [...prevState, asset.id]);
													await handleOnFavoritesToggle(asset.id);
													setAssetIdsToFavorite(prevState =>
														prevState.filter(id => id !== asset.id)
													);
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
					</Content>
				</FavoritesContainer>
			</Main>
			{previewIsSuccess ? (
				<PreviewBackdrop
					open={previewIsSuccess}
					onClick={() => {
						previewReset();
						setDocs([]);
					}}
					docs={docs}
				/>
			) : null}
		</>
	);
};
