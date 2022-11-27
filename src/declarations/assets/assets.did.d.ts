import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Asset {
  'asset_type' : string,
  'name' : string,
  'size' : number,
  'mime_type' : string,
  'created_at' : bigint,
  'user_id' : Principal,
  'is_favorite' : boolean,
  'parent_id' : [] | [number],
  'asset_id' : number,
  'extension' : string,
}
export interface _SERVICE { 'get_assets' : ActorMethod<[], Array<Asset>> }
