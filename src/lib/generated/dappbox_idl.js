export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Principal;
  const Time = IDL.Int;
  const Profile = IDL.Record({ 'userId' : UserId, 'createdAt' : Time });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : Profile, 'err' : Error });
  return IDL.Service({
    'createUser' : IDL.Func([], [Result], []),
    'getUser' : IDL.Func([], [Result], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
