export const idlFactory = ({ IDL }) => {
  const AssetType = IDL.Variant({ 'Folder' : IDL.Null, 'File' : IDL.Null });
  const Chunk = IDL.Record({
    'id' : IDL.Nat32,
    'canister' : IDL.Principal,
    'index' : IDL.Nat32,
  });
  const PostAsset = IDL.Record({
    'asset_type' : AssetType,
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
    'asset_type' : AssetType,
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
  const ApiError = IDL.Variant({
    'NotFound' : IDL.Text,
    'Unauthorized' : IDL.Text,
    'AlreadyExists' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : Asset, 'Err' : ApiError });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat32), 'Err' : ApiError });
  const EditAsset = IDL.Record({
    'id' : IDL.Nat32,
    'name' : IDL.Opt(IDL.Text),
    'is_favorite' : IDL.Opt(IDL.Bool),
    'parent_id' : IDL.Opt(IDL.Nat32),
    'extension' : IDL.Opt(IDL.Text),
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Vec(Asset), 'Err' : ApiError });
  const MoveAsset = IDL.Record({
    'id' : IDL.Nat32,
    'parent_id' : IDL.Opt(IDL.Nat32),
  });
  return IDL.Service({
    'add_asset' : IDL.Func([PostAsset], [Result], []),
    'delete_assets' : IDL.Func([IDL.Vec(IDL.Nat32)], [Result_1], []),
    'edit_asset' : IDL.Func([EditAsset], [Result], []),
    'get_assets' : IDL.Func([], [Result_2], ['query']),
    'get_user_assets' : IDL.Func([], [Result_2], ['query']),
    'move_assets' : IDL.Func([IDL.Vec(MoveAsset)], [Result_2], []),
  });
};
export const init = ({ IDL }) => { return []; };
