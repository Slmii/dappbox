import Divider from '@mui/material/Divider';

import { ViewActions } from 'components/view-actions';
import { ViewAssets } from 'components/view-assets';
import { ViewMode } from 'components/view-mode';
import { Box } from 'ui-components/box';
import { Breadcrumbs } from 'ui-components/breadcrumbs';
import { Content, FilesContainer, Main } from 'ui-components/container';

export const Home = () => {
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
				<ViewActions />
			</Content>
			<FilesContainer>
				<ViewAssets />
			</FilesContainer>
		</Main>
	);
};
