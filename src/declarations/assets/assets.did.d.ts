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
export type Result = { 'Ok' : Asset } |
  { 'Err' : ApiError };
export interface _SERVICE {
  'add_asset' : ActorMethod<[PostAsset], Asset>,
  'edit_asset' : ActorMethod<[EditAsset], Result>,
  'get_user_assets' : ActorMethod<[], Array<Asset>>,
}
