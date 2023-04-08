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
export interface ChunkStoreState {
  'canister_owner' : Principal,
  'chunk_id' : number,
  'chunks' : Array<[number, Principal]>,
}
export interface PostChunk { 'blob' : Uint8Array | number[], 'index' : number }
export type RejectionCode = { 'NoError' : null } |
  { 'CanisterError' : null } |
  { 'SysTransient' : null } |
  { 'DestinationInvalid' : null } |
  { 'Unknown' : null } |
  { 'SysFatal' : null } |
  { 'CanisterReject' : null };
export type Result = { 'Ok' : Chunk } |
  { 'Err' : ApiError };
export type Result_1 = { 'Ok' : Uint32Array | number[] } |
  { 'Err' : ApiError };
export type Result_2 = {
    'Ok' : Array<[[number, Principal], Uint8Array | number[]]>
  } |
  { 'Err' : ApiError };
export type Result_3 = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : ApiError };
export type Result_4 = { 'Ok' : ChunkStoreState } |
  { 'Err' : ApiError };
export interface _SERVICE {
  'add_chunk' : ActorMethod<[PostChunk], Result>,
  'delete_chunks' : ActorMethod<[Uint32Array | number[]], Result_1>,
  'delete_chunks_intercanister_call' : ActorMethod<
    [Principal, Uint32Array | number[]],
    Result_1
  >,
  'get_all_chunks' : ActorMethod<[], Result_2>,
  'get_chunks_by_chunk_id' : ActorMethod<[number], Result_3>,
  'get_state' : ActorMethod<[], Result_4>,
}
