import { Principal } from '@dfinity/principal';

import { _SERVICE, PostChunk } from 'declarations/chunks/chunks.did';
import { resolve, unwrap } from 'lib/utils/unwrap.utils';
import { Actor } from './actor';

export abstract class Chunks {
	static async addChunk({ chunk, canisterPrincipal }: { chunk: PostChunk; canisterPrincipal?: Principal }) {
		const actor = await Actor.getActor<_SERVICE>('chunks', canisterPrincipal);

		return resolve(async () => {
			const response = await actor.add_chunk(chunk);
			return unwrap(response);
		});
	}

	static async deleteChunks({ chunkIds, canisterPrincipal }: { chunkIds: number[]; canisterPrincipal: Principal }) {
		const actor = await Actor.getActor<_SERVICE>('chunks', canisterPrincipal);

		return resolve(async () => {
			const response = await actor.delete_chunks(Uint32Array.from(chunkIds));
			return unwrap(response);
		});
	}

	static async getChunksByChunkId({
		chunkId,
		canisterPrincipal
	}: {
		chunkId: number;
		canisterPrincipal?: Principal;
	}) {
		const actor = await Actor.getActor<_SERVICE>('chunks', canisterPrincipal);

		return resolve(async () => {
			const response = await actor.get_chunks_by_chunk_id(chunkId);
			const unwrapped = await unwrap(response);

			return unwrapped as Uint8Array;
		});
	}
}
