export const idlFactory = ({ IDL }) => {
  const PostAsset = IDL.Record({
    'asset_type' : IDL.Text,
    'name' : IDL.Text,
    'mime_type' : IDL.Text,
    'user_id' : IDL.Principal,
    'parent_id' : IDL.Opt(IDL.Nat32),
    'blobs' : IDL.Vec(IDL.Nat8),
    'extension' : IDL.Text,
  });
  const Asset = IDL.Record({
    'id' : IDL.Nat32,
    'asset_type' : IDL.Text,
    'name' : IDL.Text,
    'size' : IDL.Nat64,
    'mime_type' : IDL.Text,
    'created_at' : IDL.Nat64,
    'user_id' : IDL.Principal,
    'is_favorite' : IDL.Bool,
    'parent_id' : IDL.Opt(IDL.Nat32),
    'extension' : IDL.Text,
  });
  return IDL.Service({
    'add_asset' : IDL.Func([PostAsset], [Asset], []),
    'get_user_assets' : IDL.Func([], [IDL.Vec(Asset)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
