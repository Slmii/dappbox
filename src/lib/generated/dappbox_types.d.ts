import type { Principal } from '@dfinity/principal';
export type Error = { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyExists' : null };
export interface Profile { 'userId' : UserId, 'createdAt' : Time }
export type Result = { 'ok' : Profile } |
  { 'err' : Error };
export type Time = bigint;
export type UserId = Principal;
export interface _SERVICE {
  'createUser' : () => Promise<Result>,
  'getUser' : () => Promise<Result>,
}
