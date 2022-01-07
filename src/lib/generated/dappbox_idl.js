export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Principal;
  const Time = IDL.Int;
  const User = IDL.Record({ 'userId' : UserId, 'createdAt' : Time });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : User, 'err' : Error });
  const AssetId = IDL.Nat32;
  const UserId__1 = IDL.Principal;
  const Asset = IDL.Record({
    'assetId' : AssetId,
    'userId' : UserId__1,
    'name' : IDL.Text,
    'createdAt' : Time,
    'size' : IDL.Opt(IDL.Nat),
    'mimeType' : IDL.Opt(IDL.Text),
    'isFavorite' : IDL.Bool,
    'assetType' : IDL.Text,
    'parentId' : IDL.Opt(AssetId),
    'extension' : IDL.Opt(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Vec(Asset), 'err' : Error });
  const DappBox = IDL.Service({
    'createUser' : IDL.Func([], [Result], []),
    'getAssets' : IDL.Func([], [Result_1], ['query']),
    'getUser' : IDL.Func([], [Result], ['query']),
  });
  return DappBox;
};
export const init = ({ IDL }) => { return []; };
