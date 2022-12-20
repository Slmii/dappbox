export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'username' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Nat64,
    'user_id' : IDL.Principal,
    'canisters' : IDL.Vec(IDL.Principal),
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
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : ApiError });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(User), 'Err' : ApiError });
  return IDL.Service({
    'create_user' : IDL.Func([IDL.Opt(IDL.Text)], [Result], []),
    'get_chunks_wasm' : IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    'get_user' : IDL.Func([], [Result], ['query']),
    'get_users' : IDL.Func([], [Result_1], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
