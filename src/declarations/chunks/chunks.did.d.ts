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
export interface Chunk {
  'id' : number,
  'canister' : Principal,
  'index' : number,
}
export interface PostChunk { 'blob' : Uint8Array, 'index' : number }
export type RejectionCode = { 'NoError' : null } |
  { 'CanisterError' : null } |
  { 'SysTransient' : null } |
  { 'DestinationInvalid' : null } |
  { 'Unknown' : null } |
  { 'SysFatal' : null } |
  { 'CanisterReject' : null };
export type Result = { 'Ok' : Chunk } |
  { 'Err' : ApiError };
export type Result_1 = { 'Ok' : Array<[[number, Principal], Uint8Array]> } |
  { 'Err' : ApiError };
export type Result_2 = { 'Ok' : Uint8Array } |
  { 'Err' : ApiError };
export interface _SERVICE {
  'add_chunk' : ActorMethod<[PostChunk], Result>,
  'get_chunks' : ActorMethod<[], Result_1>,
  'get_chunks_by_chunk_id' : ActorMethod<[number], Result_2>,
}
