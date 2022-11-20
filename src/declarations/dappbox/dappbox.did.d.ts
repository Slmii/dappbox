import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Asset {
  'assetId' : AssetId,
  'userId' : UserId__1,
  'name' : string,
  'createdAt' : Time,
  'size' : [] | [number],
  'mimeType' : [] | [string],
  'isFavorite' : boolean,
  'assetType' : string,
  'parentId' : [] | [AssetId],
  'extension' : [] | [string],
}
export type AssetId = number;
export interface DappBox {
  'createUser' : ActorMethod<[], Result>,
  'getAssets' : ActorMethod<[], Result_1>,
  'getUser' : ActorMethod<[], Result>,
}
export type Error = { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyExists' : null };
export type Result = { 'ok' : User } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Array<Asset> } |
  { 'err' : Error };
export type Time = bigint;
export interface User { 'userId' : UserId, 'createdAt' : Time }
export type UserId = Principal;
export type UserId__1 = Principal;
export interface _SERVICE extends DappBox {}
