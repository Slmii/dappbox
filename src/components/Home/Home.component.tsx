import { ViewActions } from 'components/ViewActions';
import { ViewAssets } from 'components/ViewAssets';
import { ViewMode } from 'components/ViewMode';
import { useUserAssets } from 'lib/hooks';
import { Box, RowBox } from 'ui-components/Box';
import { Breadcrumbs } from 'ui-components/Breadcrumbs';
import { Content, FilesContainer, Main } from 'ui-components/Container';
import { Divider } from 'ui-components/Divider';
import { TableLoader } from 'ui-components/Loaders';

export const Home = () => {
	const { data: assets, isLoading } = useUserAssets();
	const isLoaded = !!assets && !isLoading;

	return (
		<Main>
			<Content>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%'
					}}
				>
					<Breadcrumbs />
					<ViewMode />
				</Box>
			</Content>
			<Divider />
			<Content>
				<RowBox>
					{isLoaded && <ViewActions />}
					<FilesContainer>{!isLoaded ? <TableLoader /> : <ViewAssets assets={assets} />}</FilesContainer>
				</RowBox>
			</Content>
		</Main>
	);
};
