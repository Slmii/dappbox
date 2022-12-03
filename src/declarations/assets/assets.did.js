export const idlFactory = ({ IDL }) => {
  const Chunk = IDL.Record({
    'id' : IDL.Nat32,
    'canister' : IDL.Principal,
    'index' : IDL.Nat32,
  });
  const PostAsset = IDL.Record({
    'asset_type' : IDL.Text,
    'name' : IDL.Text,
    'size' : IDL.Nat32,
    'mime_type' : IDL.Text,
    'user_id' : IDL.Principal,
    'parent_id' : IDL.Opt(IDL.Nat32),
    'chunks' : IDL.Vec(Chunk),
    'extension' : IDL.Text,
  });
  const Asset = IDL.Record({
    'id' : IDL.Nat32,
    'updated_at' : IDL.Nat64,
    'asset_type' : IDL.Text,
    'name' : IDL.Text,
    'size' : IDL.Nat32,
    'mime_type' : IDL.Text,
    'created_at' : IDL.Nat64,
    'user_id' : IDL.Principal,
    'is_favorite' : IDL.Bool,
    'parent_id' : IDL.Opt(IDL.Nat32),
    'chunks' : IDL.Vec(Chunk),
    'extension' : IDL.Text,
  });
  const PostChunk = IDL.Record({
    'blob' : IDL.Vec(IDL.Nat8),
    'index' : IDL.Nat32,
  });
  const EditAsset = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'is_favorite' : IDL.Opt(IDL.Bool),
    'parent_id' : IDL.Opt(IDL.Nat32),
    'asset_id' : IDL.Nat32,
  });
  const ApiError = IDL.Variant({
    'NotFound' : IDL.Text,
    'Unauthorized' : IDL.Text,
    'AlreadyExists' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : Asset, 'Err' : ApiError });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : ApiError });
  return IDL.Service({
    'add_asset' : IDL.Func([PostAsset], [Asset], []),
    'add_chunk' : IDL.Func([PostChunk], [Chunk], []),
    'edit_asset' : IDL.Func([EditAsset], [Result], []),
    'get_chunks_by_chunk_id' : IDL.Func([IDL.Nat32], [Result_1], ['query']),
    'get_user_assets' : IDL.Func([], [IDL.Vec(Asset)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
