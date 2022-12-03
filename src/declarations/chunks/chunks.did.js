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
  const ApiError = IDL.Variant({
    'NotFound' : IDL.Text,
    'Unauthorized' : IDL.Text,
    'AlreadyExists' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : ApiError });
  return IDL.Service({
    'add_chunk' : IDL.Func([PostChunk], [Chunk], []),
    'get_chunks_by_chunk_id' : IDL.Func([IDL.Nat32], [Result], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
