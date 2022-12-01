export const idlFactory = ({ IDL }) => {
  const Chunk = IDL.Record({ 'id' : IDL.Nat32, 'canister' : IDL.Principal });
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
  return IDL.Service({
    'add_asset' : IDL.Func([PostAsset], [Asset], []),
    'add_chunk' : IDL.Func([IDL.Vec(IDL.Nat8)], [Chunk], []),
    'get_chunks_by_chunk_id' : IDL.Func(
        [IDL.Nat32],
        [IDL.Vec(IDL.Nat8)],
        ['query'],
      ),
    'get_user_assets' : IDL.Func([], [IDL.Vec(Asset)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
