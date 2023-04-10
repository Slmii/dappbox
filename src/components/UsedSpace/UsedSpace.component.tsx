import { LinearProgress } from '@mui/material';
import { useMemo } from 'react';

import { useUserAssets } from 'lib/hooks';
import { formatBytes } from 'lib/utils/conversion.utils';
import { Box, Column } from 'ui-components/Box';
import { Content } from 'ui-components/Container';
import { Icon } from 'ui-components/Icon';
import { Caption } from 'ui-components/Typography';

export const UsedSpace = () => {
	const { data: assets, isLoading } = useUserAssets();

	const { bytes, percentage } = useMemo(() => {
		if (assets) {
			const bytes = assets.reduce((accum, asset) => (accum += asset.size ?? 0), 0);
			return {
				percentage: (Number(bytes) / 4000000000) * 100,
				bytes
			};
		}

		return {
			percentage: 0,
			bytes: 0
		};
	}, [assets]);

	const isLoaded = !!assets && !isLoading;

	return (
		<Box
			sx={{
				marginTop: 'auto'
			}}
		>
			<Content>
				<Column>
					<Caption>{formatBytes(bytes)} of 4 GB used</Caption>
					<Icon
						icon='info'
						fontSize='inherit'
						sx={{ marginBottom: '2px' }}
						label='This is an estimate of your used space.'
					/>
				</Column>
				<LinearProgress
					variant={!isLoaded ? 'indeterminate' : 'determinate'}
					value={percentage}
					color='secondary'
				/>
			</Content>
		</Box>
	);
};
