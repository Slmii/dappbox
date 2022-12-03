import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'NotFound' : string } |
  { 'Unauthorized' : string } |
  { 'AlreadyExists' : string };
export interface Asset {
  'id' : number,
  'updated_at' : bigint,
  'asset_type' : AssetType,
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
export type AssetType = { 'Folder' : null } |
  { 'File' : null };
export interface Chunk {
  'id' : number,
  'canister' : Principal,
  'index' : number,
}
export interface EditAsset {
  'id' : number,
  'name' : [] | [string],
  'is_favorite' : [] | [boolean],
  'parent_id' : [] | [number],
  'extension' : [] | [string],
}
export interface MoveAsset { 'id' : number, 'parent_id' : [] | [number] }
export interface PostAsset {
  'asset_type' : AssetType,
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
export type Result_1 = { 'Ok' : Array<Asset> } |
  { 'Err' : ApiError };
export interface _SERVICE {
  'add_asset' : ActorMethod<[PostAsset], Asset>,
  'edit_asset' : ActorMethod<[EditAsset], Result>,
  'get_user_assets' : ActorMethod<[], Array<Asset>>,
  'move_assets' : ActorMethod<[Array<MoveAsset>], Result_1>,
}
