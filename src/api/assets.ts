import { _SERVICE, Asset as ControllerAsset, PostAsset } from 'declarations/assets/assets.did';
import { dateFromBigInt } from 'lib/dates';
import { resolve } from 'lib/functions';
import { Asset as IAsset, AssetType } from 'lib/types/Asset.types';
import { Actor } from './actor';

export abstract class Asset {
	static async addChunk(chunk: Uint8Array) {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.add_chunk(chunk);
			return response;
		});
	}

	static async addAsset(asset: PostAsset) {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.add_asset(asset);
			return mapToAssetInterface(response);
		});
	}

	static async getUserAssets() {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.get_user_assets();
			return response.map(asset => mapToAssetInterface(asset));
		});
	}

	static async getChunksByChunkId(chunkId: number) {
		const actor = await Actor.getActor<_SERVICE>('assets');

		return resolve(async () => {
			const response = await actor.get_chunks_by_chunk_id(chunkId);
			return response;
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
		chunks: asset.chunks,
		createdAt: dateFromBigInt(asset.created_at)
	};
};
