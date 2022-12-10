import { _SERVICE, Asset as ControllerAsset, EditAsset, MoveAsset, PostAsset } from 'declarations/assets/assets.did';
import { dateFromBigInt } from 'lib/dates';
import { resolve, unwrap } from 'lib/functions';
import { Asset as IAsset, AssetType } from 'lib/types/Asset.types';
import { Actor } from './actor';

export abstract class Asset {
	static async addAsset(asset: PostAsset) {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.add_asset(asset);
			return mapToAssetInterface(response);
		});
	}

	static async editAsset(asset: EditAsset) {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.edit_asset(asset);
			const unwrapped = await unwrap(response);

			return mapToAssetInterface(unwrapped);
		});
	}

	static async moveAssets(assets: MoveAsset[]) {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.move_assets(assets);
			const unwrapped = await unwrap(response);

			return unwrapped.map(asset => mapToAssetInterface(asset));
		});
	}

	static async deleteAssets(assets: number[]) {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.delete_assets(Uint32Array.from(assets));
			const unwrapped = await unwrap(response);

			return unwrapped.map(asset => mapToAssetInterface(asset));
		});
	}

	static async getUserAssets() {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.get_user_assets();
			return response.map(asset => mapToAssetInterface(asset));
		});
	}
}

const mapToAssetInterface = (asset: ControllerAsset): IAsset => {
	return {
		id: asset.id,
		type: 'File' in asset.asset_type ? ('file' as AssetType) : ('folder' as AssetType),
		name: asset.name,
		userId: asset.user_id,
		isFavorite: asset.is_favorite,
		extension: asset.extension,
		mimeType: asset.mime_type,
		parentId: asset.parent_id.length ? asset.parent_id[0] : undefined,
		size: Number(asset.size),
		chunks: asset.chunks,
		createdAt: dateFromBigInt(asset.created_at),
		updatedAt: dateFromBigInt(asset.created_at)
	};
};
