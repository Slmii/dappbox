import { useRecoilValue } from 'recoil';

import { ViewActions } from 'components/ViewActions';
import { ViewAssets } from 'components/ViewAssets';
import { ViewMode } from 'components/ViewMode';
import { assetsAtom } from 'lib/recoil';
import { Box, RowBox } from 'ui-components/Box';
import { Breadcrumbs } from 'ui-components/Breadcrumbs';
import { Content, FilesContainer, Main } from 'ui-components/Container';
import { Divider } from 'ui-components/Divider';
import { TableLoader } from 'ui-components/Loaders';

export const Home = () => {
	const { isLoading } = useRecoilValue(assetsAtom);

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
					{!isLoading && <ViewActions />}
					<FilesContainer>{isLoading ? <TableLoader /> : <ViewAssets />}</FilesContainer>
				</RowBox>
			</Content>
		</Main>
	);
};
