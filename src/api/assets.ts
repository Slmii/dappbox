import { _SERVICE, Asset as ControllerAsset, EditAsset, MoveAsset, PostAsset } from 'declarations/assets/assets.did';
import { Asset as IAsset, AssetType } from 'lib/types';
import { uint32ArrayToNumbers } from 'lib/utils/conversion.utils';
import { dateFromBigInt } from 'lib/utils/date.utils';
import { resolve, unwrap } from 'lib/utils/unwrap.utils';
import { Actor } from './actor';

export abstract class Assets {
	static async addAsset(asset: PostAsset) {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.add_asset(asset);
			const unwrapped = await unwrap(response);

			return mapToAssetInterface(unwrapped);
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

			return uint32ArrayToNumbers(unwrapped);
		});
	}

	static async getUserAssets() {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.get_user_assets();
			const unwrapped = await unwrap(response);

			return unwrapped.map(asset => mapToAssetInterface(asset));
		});
	}
}

export const mapToAssetInterface = (asset: ControllerAsset): IAsset => {
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
		placeholder: false,
		createdAt: dateFromBigInt(asset.created_at),
		updatedAt: dateFromBigInt(asset.updated_at)
	};
};
