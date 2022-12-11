export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'username' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Nat64,
    'user_id' : IDL.Principal,
  });
  const ApiError = IDL.Variant({
    'NotFound' : IDL.Text,
    'Unauthorized' : IDL.Text,
    'AlreadyExists' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : ApiError });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(User), 'Err' : ApiError });
  return IDL.Service({
    'create_user' : IDL.Func([IDL.Opt(IDL.Text)], [Result], []),
    'get_user' : IDL.Func([], [Result], ['query']),
    'get_users' : IDL.Func([], [Result_1], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
