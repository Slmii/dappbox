import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { assetsAtom, favoriteAssetsSelector } from 'lib/recoil';
import { getUrlPathToAsset } from 'lib/url';
import { Box } from 'ui-components/box';
import { Content, Main } from 'ui-components/container';
import { Icon } from 'ui-components/icon';
import { IconButton } from 'ui-components/icon-button';
import { Link } from 'ui-components/link';
import { TableLoader } from 'ui-components/table';
import { Body, PageTitle } from 'ui-components/typography';

export const Favorites = () => {
	const { assets, isLoading } = useRecoilValue(assetsAtom);
	const favoriteAssets = useRecoilValue(favoriteAssetsSelector);

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
					<Stack spacing={0}>
						{favoriteAssets.map(asset => (
							<Link key={asset.assetId} href={`/${generateAssetPath(asset.assetId)}`}>
								<TableCell
									component='div'
									sx={{
										display: 'flex',
										alignItems: 'center',
										'&: hover': {
											backgroundColor: 'action.hover'
										}
									}}
									size='small'
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
											color='error'
											label='Remove from favorites'
											onClick={e => e.preventDefault()}
										/>
									</Box>
								</TableCell>
							</Link>
						))}
					</Stack>
				)}
			</>
		</Main>
	);
};
