import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Asset {
  'id' : number,
  'asset_type' : string,
  'name' : string,
  'size' : number,
  'mime_type' : string,
  'created_at' : bigint,
  'user_id' : Principal,
  'is_favorite' : boolean,
  'parent_id' : [] | [number],
  'chunks' : Array<Chunk>,
  'extension' : string,
}
export interface Chunk { 'id' : number, 'canister' : Principal }
export interface PostAsset {
  'asset_type' : string,
  'name' : string,
  'size' : number,
  'mime_type' : string,
  'user_id' : Principal,
  'parent_id' : [] | [number],
  'chunks' : Array<Chunk>,
  'extension' : string,
}
export interface _SERVICE {
  'add_asset' : ActorMethod<[PostAsset], Asset>,
  'add_chunk' : ActorMethod<[Uint8Array], Chunk>,
  'get_chunks_by_chunk_id' : ActorMethod<[number], Uint8Array>,
  'get_user_assets' : ActorMethod<[], Array<Asset>>,
}
