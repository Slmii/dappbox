import Divider from '@mui/material/Divider';

import { ViewActions } from 'components/view-actions';
import { ViewAssets } from 'components/view-assets';
import { ViewMode } from 'components/view-mode';
import { useInitAssets } from 'lib/hooks';
import { Box } from 'ui-components/box';
import { Breadcrumbs } from 'ui-components/breadcrumbs';
import { FilesContainer, Main, TopContainer } from 'ui-components/container';
import { Drawer } from 'ui-components/drawer';

export const Home = () => {
	useInitAssets();

	return (
		<Main>
			<Drawer />
			<TopContainer>
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
			</TopContainer>
			<Divider />
			<FilesContainer>
				<ViewActions />
				<ViewAssets />
			</FilesContainer>
		</Main>
	);
};
