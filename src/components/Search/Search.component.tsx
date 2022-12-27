import { useEffect, useState } from 'react';

import { useDebounce, useUserAssets } from 'lib/hooks';
import { Asset } from 'lib/types/Asset.types';
import { Box } from 'ui-components/Box';
import { StandaloneField } from 'ui-components/Field';

export const Search = ({ onSearch }: { onSearch: (assets: Asset[]) => void }) => {
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search);

	const { data: assets } = useUserAssets();
	useEffect(() => {
		if (!assets) {
			return onSearch([]);
		}

		if (!debouncedSearch.length) {
			return onSearch(assets);
		}

		const searchToLowerCase = debouncedSearch.toLowerCase();
		return onSearch(
			assets.filter(asset => {
				const assetNameToLowerCase = asset.name.toLowerCase();
				return assetNameToLowerCase.includes(searchToLowerCase);
			})
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assets, debouncedSearch]);

	return (
		<Box sx={{ marginLeft: 'auto', width: 500, height: '100%' }}>
			<StandaloneField
				name='search'
				placeholder='Search your assets...'
				size='small'
				fullWidth
				value={search}
				onChange={setSearch}
				startIcon='search'
			/>
		</Box>
	);
};
