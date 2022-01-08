import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import { useRecoilValue } from 'recoil';

import { assetsAtom, favoriteAssetsSelector } from 'lib/recoil';
import { getUrlPathToAsset } from 'lib/url';
import { Box } from 'ui-components/box';
import { Content, Main } from 'ui-components/container';
import { Icon } from 'ui-components/icon';
import { IconButton } from 'ui-components/icon-button';
import { Link } from 'ui-components/link';
import { Body, PageTitle } from 'ui-components/typography';

export const Favorites = () => {
	const { isLoading } = useRecoilValue(assetsAtom);
	const assets = useRecoilValue(favoriteAssetsSelector);

	const generateAssetPath = (assetId: number) => {
		return getUrlPathToAsset(assetId, assets)
			.map(asset => encodeURIComponent(asset.assetId))
			.join('/');
	};

	return (
		<Main>
			<Content>
				<PageTitle title='Favorites' />
			</Content>
			<Divider />
			<>
				{isLoading ? (
					<FavoritesLoading />
				) : (
					<Stack spacing={0}>
						{assets.map(asset => (
							<Link key={asset.assetId} href={`${generateAssetPath(asset.assetId)}`}>
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

const FavoritesLoading = () => {
	const render = () => {
		const jsx: JSX.Element[] = [];

		for (let i = 0; i < 10; i++) {
			jsx.push(<Skeleton variant='text' animation='wave' width='100%' height='100px' />);
		}

		return <Stack spacing={2}>{jsx}</Stack>;
	};

	return <>{render()}</>;
};
