import { _SERVICE, Asset as ControllerAsset, PostAsset as ControllerPostAsset } from 'declarations/assets/assets.did';
import { dateFromBigInt } from 'lib/dates';
import { resolve } from 'lib/functions';
import { Asset as IAsset, AssetType, PostAsset } from 'lib/types/Asset.types';
import { Actor } from './actor';

export abstract class Asset {
	static async addAsset(asset: PostAsset) {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.add_asset(mapToPostInterface(asset));
			return mapToAssetInterface(response);
		});
	}

	static async getUserAssets() {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const userAssets = await actor.get_user_assets();
			return userAssets.map(asset => mapToAssetInterface(asset));
		});
	}
}

const mapToAssetInterface = (asset: ControllerAsset): IAsset => {
	return {
		id: asset.id,
		type: asset.asset_type as AssetType,
		name: asset.name,
		userId: asset.user_id,
		isFavorite: asset.is_favorite,
		extension: asset.extension,
		mimeType: asset.mime_type,
		parentId: asset.parent_id.length ? asset.parent_id[0] : undefined,
		size: Number(asset.size),
		createdAt: dateFromBigInt(asset.created_at)
	};
};

const mapToPostInterface = (asset: PostAsset): ControllerPostAsset => {
	return {
		asset_type: asset.type,
		blobs: Uint8Array.from(asset.blobs),
		extension: asset.extension,
		mime_type: asset.mimeType,
		name: asset.name,
		parent_id: asset.parentId ? [asset.parentId] : [],
		user_id: asset.userId
	};
};
