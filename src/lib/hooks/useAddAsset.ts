import { Principal } from '@dfinity/principal';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from 'api';
import { constants } from 'lib/constants';
import { Asset } from 'lib/types/Asset.types';

export const useAddAsset = () => {
	const queryClient = useQueryClient();

	const updateCache = (assetId: number, updatedAsset: Asset) => {
		queryClient.setQueryData<Asset[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
			if (!old) {
				return [];
			}

			// Update the placeholder with the actual asset
			return old.map(asset => {
				if (asset.id === assetId) {
					return updatedAsset;
				}

				return asset;
			});
		});
	};

	const data = useMutation({
		mutationFn: api.Assets.addAsset,
		onMutate: asset => {
			queryClient.setQueriesData<Asset[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				return [
					{
						id: asset.placeholderId,
						userId: Principal.fromText('aaaaa-aa'),
						parentId: undefined,
						type: 'Folder' in asset.asset_type ? 'folder' : 'file',
						name: asset.name,
						size: asset.size,
						mimeType: asset.mime_type,
						extension: asset.extension,
						isFavorite: false,
						placeholder: true,
						chunks: [],
						settings: asset.settings,
						createdAt: new Date(),
						updatedAt: new Date()
					},
					...old
				];
			});

			return { placeholderId: asset.placeholderId };
		},
		onError: (_error, _variables, context) => {
			queryClient.setQueryData<Asset[]>([constants.QUERY_KEYS.USER_ASSETS], old => {
				if (!old) {
					return [];
				}

				return old.filter(cachedAsset => cachedAsset.id !== context?.placeholderId);
			});
		}
	});

	return { ...data, updateCache };
};
