import { useRecoilValue } from 'recoil';

import { ViewActions } from 'components/view-actions';
import { ViewAssets } from 'components/view-assets';
import { ViewMode } from 'components/view-mode';
import { assetsAtom } from 'lib/recoil';
import { Box, RowBox } from 'ui-components/box';
import { Breadcrumbs } from 'ui-components/breadcrumbs';
import { Content, FilesContainer, Main } from 'ui-components/container';
import { Divider } from 'ui-components/divider';
import { TableLoader } from 'ui-components/loaders';

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
