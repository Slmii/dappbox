import { useRecoilValue } from 'recoil';

import { favoriteAssetsState } from 'lib/recoil';
import { Box } from 'ui-components/box';
import { Content, Main } from 'ui-components/container';
import { PageTitle } from 'ui-components/typography';

export const Favorites = () => {
	// const generateBreadcrumbPath = (assetId: number) => {
	// 	return getUrlPathToAsset(assetId, assets)
	// 		.map(asset => encodeURIComponent(asset.assetId))
	// 		.join('/');
	// };

	const assets = useRecoilValue(favoriteAssetsState);

	return (
		<Main>
			<Content>
				<PageTitle title='Favorites' />
				{assets.map(asset => (
					<Box key={asset.assetId}>{asset.name}</Box>
				))}
			</Content>
		</Main>
	);
};
