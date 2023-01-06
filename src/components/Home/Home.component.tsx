import { useState } from 'react';

import { Actions } from 'components/Actions';
import { Search } from 'components/Search';
import { ViewAssets } from 'components/ViewAssets';
// import { ViewMode } from 'components/ViewMode';
import { useUserAssets } from 'lib/hooks';
import { Asset } from 'lib/types';
import { Column, Row } from 'ui-components/Box';
import { Breadcrumbs } from 'ui-components/Breadcrumbs';
import { Content, FilesContainer, Main } from 'ui-components/Container';
import { Divider } from 'ui-components/Divider';
import { TableLoader } from 'ui-components/Loaders';

export const Home = () => {
	const { data, isLoading } = useUserAssets();
	const [assets, setAssets] = useState<Asset[]>([]);

	const isLoaded = !!data && !isLoading;

	return (
		<Main>
			<Content>
				<Column>
					<Breadcrumbs />
					{/* <ViewMode /> */}
					<Search onSearch={setAssets} />
				</Column>
			</Content>
			<Divider />
			<Content>
				<Row>
					{isLoaded && <Actions />}
					<FilesContainer>{!isLoaded ? <TableLoader /> : <ViewAssets assets={assets} />}</FilesContainer>
				</Row>
			</Content>
		</Main>
	);
};
