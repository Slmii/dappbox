import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'NotFound' : string } |
  { 'Unauthorized' : string } |
  { 'AlreadyExists' : string } |
  { 'CanisterFailed' : CanisterFailedError };
export interface CanisterFailedError {
  'code' : RejectionCode,
  'message' : string,
}
export type RejectionCode = { 'NoError' : null } |
  { 'CanisterError' : null } |
  { 'SysTransient' : null } |
  { 'DestinationInvalid' : null } |
  { 'Unknown' : null } |
  { 'SysFatal' : null } |
  { 'CanisterReject' : null };
export type Result = { 'Ok' : User } |
  { 'Err' : ApiError };
export type Result_1 = { 'Ok' : Array<[Principal, Array<Principal>]> } |
  { 'Err' : ApiError };
export type Result_2 = { 'Ok' : Array<User> } |
  { 'Err' : ApiError };
export interface User {
  'username' : [] | [string],
  'created_at' : bigint,
  'user_id' : Principal,
  'canisters' : Array<Principal>,
}
export interface _SERVICE {
  'create_user' : ActorMethod<[[] | [string]], Result>,
  'get_chunks_wasm' : ActorMethod<[], Uint8Array>,
  'get_user' : ActorMethod<[], Result>,
  'get_user_canisters' : ActorMethod<[], Result_1>,
  'get_users' : ActorMethod<[], Result_2>,
}
