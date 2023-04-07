export const idlFactory = ({ IDL }) => {
  const Nft = IDL.Record({ 'principal' : IDL.Principal, 'index' : IDL.Nat32 });
  const AssetType = IDL.Variant({
    'NFT' : Nft,
    'Folder' : IDL.Null,
    'File' : IDL.Null,
  });
  const Privacy = IDL.Variant({ 'Private' : IDL.Null, 'Public' : IDL.Null });
  const Settings = IDL.Record({
    'url' : IDL.Opt(IDL.Text),
    'privacy' : Privacy,
  });
  const Chunk = IDL.Record({
    'id' : IDL.Nat32,
    'canister' : IDL.Principal,
    'index' : IDL.Nat32,
  });
  const PostAsset = IDL.Record({
    'id' : IDL.Opt(IDL.Nat32),
    'asset_type' : AssetType,
    'name' : IDL.Text,
    'size' : IDL.Nat32,
    'mime_type' : IDL.Text,
    'user_id' : IDL.Principal,
    'parent_id' : IDL.Opt(IDL.Nat32),
    'settings' : Settings,
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
    'settings' : Settings,
    'chunks' : IDL.Vec(Chunk),
    'extension' : IDL.Text,
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
  const InviteStatus = IDL.Variant({
    'Accepted' : IDL.Null,
    'Declined' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const Invite = IDL.Record({
    'status' : InviteStatus,
    'invited_by_username' : IDL.Opt(IDL.Text),
    'asset_id' : IDL.Nat32,
    'invited_by_principal' : IDL.Principal,
    'expires_at' : IDL.Opt(IDL.Nat64),
  });
  const SharedWith = IDL.Record({
    'principal' : IDL.Principal,
    'username' : IDL.Opt(IDL.Text),
  });
  const AssetsStore = IDL.Record({
    'shared' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Nat32))),
    'assets' : IDL.Vec(IDL.Tuple(IDL.Nat32, Asset)),
    'user_assets' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Nat32))),
    'asset_invites' : IDL.Vec(IDL.Tuple(IDL.Principal, Invite)),
    'asset_id' : IDL.Nat32,
    'shared_with' : IDL.Vec(
      IDL.Tuple(IDL.Tuple(IDL.Principal, IDL.Nat32), IDL.Vec(SharedWith))
    ),
  });
  const Result_3 = IDL.Variant({ 'Ok' : AssetsStore, 'Err' : ApiError });
  const MoveAsset = IDL.Record({
    'id' : IDL.Nat32,
    'parent_id' : IDL.Opt(IDL.Nat32),
  });
  return IDL.Service({
    'add_asset' : IDL.Func([PostAsset], [Result], []),
    'delete_assets' : IDL.Func([IDL.Vec(IDL.Nat32)], [Result_1], []),
    'edit_asset' : IDL.Func([EditAsset], [Result], []),
    'get_all_assets' : IDL.Func([], [Result_2], ['query']),
    'get_state' : IDL.Func([], [Result_3], ['query']),
    'get_user_assets' : IDL.Func([], [Result_2], ['query']),
    'move_assets' : IDL.Func([IDL.Vec(MoveAsset)], [Result_2], []),
  });
};
export const init = ({ IDL }) => { return []; };
