export const idlFactory = ({ IDL }) => {
  const PostChunk = IDL.Record({
    'blob' : IDL.Vec(IDL.Nat8),
    'index' : IDL.Nat32,
  });
  const Chunk = IDL.Record({
    'id' : IDL.Nat32,
    'canister' : IDL.Principal,
    'index' : IDL.Nat32,
  });
  const RejectionCode = IDL.Variant({
    'NoError' : IDL.Null,
    'CanisterError' : IDL.Null,
    'SysTransient' : IDL.Null,
    'DestinationInvalid' : IDL.Null,
    'Unknown' : IDL.Null,
    'SysFatal' : IDL.Null,
    'CanisterReject' : IDL.Null,
  });
  const CanisterFailedError = IDL.Record({
    'code' : RejectionCode,
    'message' : IDL.Text,
  });
  const ApiError = IDL.Variant({
    'NotFound' : IDL.Text,
    'Unauthorized' : IDL.Text,
    'AlreadyExists' : IDL.Text,
    'CanisterFailed' : CanisterFailedError,
  });
  const Result = IDL.Variant({ 'Ok' : Chunk, 'Err' : ApiError });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat32), 'Err' : ApiError });
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Vec(
      IDL.Tuple(IDL.Tuple(IDL.Nat32, IDL.Principal), IDL.Vec(IDL.Nat8))
    ),
    'Err' : ApiError,
  });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : ApiError });
  const ChunkStoreState = IDL.Record({
    'canister_owner' : IDL.Principal,
    'chunk_id' : IDL.Nat32,
    'chunks' : IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Principal)),
  });
  const Result_4 = IDL.Variant({ 'Ok' : ChunkStoreState, 'Err' : ApiError });
  return IDL.Service({
    'add_chunk' : IDL.Func([PostChunk], [Result], []),
    'delete_chunks' : IDL.Func([IDL.Vec(IDL.Nat32)], [Result_1], []),
    'delete_chunks_intercanister_call' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Nat32)],
        [Result_1],
        [],
      ),
    'get_all_chunks' : IDL.Func([], [Result_2], ['query']),
    'get_chunks_by_chunk_id' : IDL.Func([IDL.Nat32], [Result_3], ['query']),
    'get_state' : IDL.Func([], [Result_4], ['query']),
  });
};
export const init = ({ IDL }) => { return [IDL.Opt(IDL.Principal)]; };
