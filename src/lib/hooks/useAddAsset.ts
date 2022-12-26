import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from 'api';
import { Assets } from 'api/assets';
import { constants } from 'lib/constants';

export const useAddAsset = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.Assets.addAsset,
		onSuccess: asset => {
			queryClient.setQueriesData<Assets[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				return [asset, ...old];
			});
		}
	});
};
