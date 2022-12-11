import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'NotFound' : string } |
  { 'Unauthorized' : string } |
  { 'AlreadyExists' : string };
export type Result = { 'Ok' : User } |
  { 'Err' : ApiError };
export type Result_1 = { 'Ok' : Array<User> } |
  { 'Err' : ApiError };
export interface User {
  'username' : [] | [string],
  'created_at' : bigint,
  'user_id' : Principal,
}
export interface _SERVICE {
  'create_user' : ActorMethod<[[] | [string]], Result>,
  'get_user' : ActorMethod<[], Result>,
  'get_users' : ActorMethod<[], Result_1>,
}
