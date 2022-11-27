export const idlFactory = ({ IDL }) => {
  const Asset = IDL.Record({
    'asset_type' : IDL.Text,
    'name' : IDL.Text,
    'size' : IDL.Nat32,
    'mime_type' : IDL.Text,
    'created_at' : IDL.Nat64,
    'user_id' : IDL.Principal,
    'is_favorite' : IDL.Bool,
    'parent_id' : IDL.Opt(IDL.Nat32),
    'asset_id' : IDL.Nat32,
    'extension' : IDL.Text,
  });
  return IDL.Service({
    'get_assets' : IDL.Func([], [IDL.Vec(Asset)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
