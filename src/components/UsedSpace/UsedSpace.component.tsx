import { LinearProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';

import { api } from 'api';
import { constants } from 'lib/constants';
import { AuthContext } from 'lib/context';
import { formatBytes } from 'lib/utils';
import { Box } from 'ui-components/Box';
import { Content } from 'ui-components/Container';
import { Caption } from 'ui-components/Typography';

export const UsedSpace = () => {
	const { isAuthenticated, user } = useContext(AuthContext);
	const { data, isLoading } = useQuery([constants.QUERY_KEYS.USED_SPACE], {
		queryFn: () => user && api.Chunk.getSize(user?.canisters[0]),
		enabled: user && isAuthenticated
	});

	const percentageBytesUsed = useMemo(() => {
		if (data) {
			return (Number(data) / 4000000000) * 100;
		}

		return 0;
	}, [data]);

	const isLoaded = !!data && !isLoading;

	return (
		<Box
			sx={{
				marginTop: 'auto'
			}}
		>
			<Content>
				<Caption gutter>{formatBytes(data ? Number(data) : 0)} of 4 GB used</Caption>
				<LinearProgress
					variant={!isLoaded ? 'indeterminate' : 'determinate'}
					value={percentageBytesUsed}
					color='secondary'
				/>
			</Content>
		</Box>
	);
};
