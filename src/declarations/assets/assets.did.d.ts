import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Asset {
  'id' : number,
  'asset_type' : string,
  'name' : string,
  'size' : bigint,
  'mime_type' : string,
  'created_at' : bigint,
  'user_id' : Principal,
  'is_favorite' : boolean,
  'parent_id' : [] | [number],
  'extension' : string,
}
export interface PostAsset {
  'asset_type' : string,
  'name' : string,
  'mime_type' : string,
  'user_id' : Principal,
  'parent_id' : [] | [number],
  'blobs' : Uint8Array,
  'extension' : string,
}
export interface _SERVICE {
  'add_asset' : ActorMethod<[PostAsset], Asset>,
  'get_user_assets' : ActorMethod<[], Array<Asset>>,
}
