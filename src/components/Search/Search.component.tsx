import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebounce, useUserAssets } from 'lib/hooks';
import { Asset } from 'lib/types';
import { Box } from 'ui-components/Box';
import { StandaloneField } from 'ui-components/Field';

export const Search = ({ onSearch }: { onSearch: (assets: Asset[]) => void }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query);

	const { data: assets } = useUserAssets();
	useEffect(() => {
		if (!assets) {
			return onSearch([]);
		}

		if (!debouncedQuery.length) {
			searchParams.delete('q');
			setSearchParams(searchParams);

			return onSearch(assets);
		}

		setSearchParams({ q: debouncedQuery });

		const searchToLowerCase = debouncedQuery.toLowerCase();
		return onSearch(
			assets.filter(asset => {
				const assetNameToLowerCase = asset.name.toLowerCase();
				return assetNameToLowerCase.includes(searchToLowerCase);
			})
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assets, debouncedQuery]);

	return (
		<Box sx={{ marginLeft: 'auto', width: 300, height: '100%' }}>
			<StandaloneField
				name='search'
				placeholder='Search your assets...'
				size='small'
				fullWidth
				value={query}
				onChange={setQuery}
				startIcon='search'
			/>
		</Box>
	);
};
