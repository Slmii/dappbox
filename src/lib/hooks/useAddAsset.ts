import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from 'api';
import { Asset } from 'api/assets';
import { constants } from 'lib/constants';

export const useAddAsset = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.Asset.addAsset,
		onSuccess: asset => {
			queryClient.setQueriesData([constants.QUERY_KEYS.USER_ASSETS], (old: Asset[] | undefined) => {
				if (!old) {
					return [];
				}

				return [asset, ...old];
			});
		}
	});
};
