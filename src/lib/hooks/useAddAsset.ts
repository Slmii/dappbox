import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from 'api';
import { constants } from 'lib/constants';
import { Asset } from 'lib/types/Asset.types';

export const useAddAsset = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.Assets.addAsset,
		onSuccess: asset => {
			queryClient.setQueriesData<Asset[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				return [asset, ...old];
			});
		}
	});
};
