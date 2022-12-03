import { Principal } from '@dfinity/principal';

import { _SERVICE, PostChunk } from 'declarations/chunks/chunks.did';
import { resolve, unwrap } from 'lib/functions';
import { Actor } from './actor';

export abstract class Chunk {
	static async addChunk(chunk: PostChunk) {
		const actor = await Actor.getActor<_SERVICE>('chunks');

		return resolve(async () => {
			const response = await actor.add_chunk(chunk);
			return response;
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
			return unwrap(response);
		});
	}
}