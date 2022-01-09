import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { useRecoilValue } from 'recoil';

import { ViewActions } from 'components/view-actions';
import { ViewAssets } from 'components/view-assets';
import { ViewMode } from 'components/view-mode';
import { assetsAtom } from 'lib/recoil';
import { Box } from 'ui-components/box';
import { Breadcrumbs } from 'ui-components/breadcrumbs';
import { Content, FilesContainer, Main } from 'ui-components/container';
import { TableLoader } from 'ui-components/table';

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
				{isLoading ? <Skeleton animation='wave' height={40} sx={{ transform: 'unset' }} /> : <ViewActions />}
			</Content>
			<FilesContainer>{isLoading ? <TableLoader /> : <ViewAssets />}</FilesContainer>
		</Main>
	);
};
