import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'NotFound' : string } |
  { 'Unauthorized' : string } |
  { 'AlreadyExists' : string };
export interface Asset {
  'id' : number,
  'updated_at' : bigint,
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
export interface Chunk {
  'id' : number,
  'canister' : Principal,
  'index' : number,
}
export interface EditAsset {
  'name' : [] | [string],
  'is_favorite' : [] | [boolean],
  'parent_id' : [] | [number],
  'asset_id' : number,
  'extension' : [] | [string],
}
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
export interface PostChunk { 'blob' : Uint8Array, 'index' : number }
export type Result = { 'Ok' : Asset } |
  { 'Err' : ApiError };
export type Result_1 = { 'Ok' : Uint8Array } |
  { 'Err' : ApiError };
export interface _SERVICE {
  'add_asset' : ActorMethod<[PostAsset], Asset>,
  'add_chunk' : ActorMethod<[PostChunk], Chunk>,
  'edit_asset' : ActorMethod<[EditAsset], Result>,
  'get_chunks_by_chunk_id' : ActorMethod<[number], Result_1>,
  'get_user_assets' : ActorMethod<[], Array<Asset>>,
}
