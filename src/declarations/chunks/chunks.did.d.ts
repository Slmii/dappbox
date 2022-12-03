import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'NotFound' : string } |
  { 'Unauthorized' : string } |
  { 'AlreadyExists' : string };
export interface Chunk {
  'id' : number,
  'canister' : Principal,
  'index' : number,
}
export interface PostChunk { 'blob' : Uint8Array, 'index' : number }
export type Result = { 'Ok' : Uint8Array } |
  { 'Err' : ApiError };
export interface _SERVICE {
  'add_chunk' : ActorMethod<[PostChunk], Chunk>,
  'get_chunks_by_chunk_id' : ActorMethod<[number], Result>,
}
