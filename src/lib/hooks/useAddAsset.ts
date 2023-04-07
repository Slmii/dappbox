import { Principal } from '@dfinity/principal';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from 'api';
import { PostAsset } from 'declarations/assets/assets.did';
import { QUERY_USER_ASSETS } from 'lib/constants/query-keys.constants';
import { Asset } from 'lib/types/Asset.types';
import { findExistingAsset } from 'lib/utils/asset.utils';

export const useAddAsset = () => {
	const queryClient = useQueryClient();

	const updateCache = (assetId: number, updater: (asset: Asset) => Partial<Asset>) => {
		queryClient.setQueryData<Asset[]>([QUERY_USER_ASSETS], old => {
			if (!old) {
				return [];
			}

			// Update the placeholder with the actual asset
			return old.map(asset => {
				if (asset.id === assetId) {
					return {
						...asset,
						...updater(asset)
					};
				}

				return asset;
			});
		});
	};

	const removePlaceholder = (placeholderId: number) => {
		queryClient.setQueryData<Asset[]>([QUERY_USER_ASSETS], old => {
			if (!old) {
				return [];
			}

			// Remove the placeholder
			return old.filter(asset => asset.id !== placeholderId);
		});
	};

	const addPlaceholder = (asset: PostAsset & { placeholderId: number }) => {
		queryClient.setQueriesData<Asset[]>([QUERY_USER_ASSETS], old => {
			if (!old) {
				return [];
			}

			// TODO: update chunks in BE for existing assets. Make this a function

			const existingAsset = findExistingAsset(old, asset);

			// If the asset already exists, mark the eixsting asset as a placeholder
			if (!!existingAsset) {
				return old.map(oldAsset => {
					if (oldAsset.id === existingAsset.id) {
						return {
							...existingAsset,
							id: asset.placeholderId,
							placeholder: true,
							size: asset.size,
							updatedAt: new Date()
						};
					}

					return oldAsset;
				});
			}

			return [
				{
					id: asset.placeholderId,
					userId: Principal.fromText('aaaaa-aa'),
					parentId: asset.parent_id[0] ? asset.parent_id[0] : undefined,
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
	};

	const data = useMutation({
		mutationFn: api.Assets.addAsset
	});

	return { ...data, updateCache, addPlaceholder, removePlaceholder };
};
