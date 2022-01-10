import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

import UserTypes "./types/user.types";
import ErrorsTypes "./types/errors.types";

module {
    type UserId = UserTypes.UserId;
    type User = UserTypes.User;
    type Error = ErrorsTypes.Error;

    func isPrincipalIdEqual(x: UserId, y: UserId): Bool { 
        return x == y; 
    };

    public class UserClass() {
        public let users = Map.HashMap<UserId, User>(1, isPrincipalIdEqual, Principal.hash);

        public func getUser(userId: UserId): Result.Result<User, Error> {
            return Result.fromOption(users.get(userId), #NotFound);
        };

        public func getUsers(): [(UserId, User)] {
            return Iter.toArray(users.entries())
        };

        public func createUser(userId: UserId): Result.Result<User, Error> {
            let result = getUser(userId);

            switch(result) {
                case (#err(_)) {
                    // Create profile
                    let user: User = {
                        userId = userId;
                        createdAt = Time.now();
                    };

                    users.put(userId, user);

                    #ok(user);
                };
                case(#ok(_)) {
                    #err(#AlreadyExists);
                };
            };
        };        

        public func rePopulateHashmap(values: [(UserId, User)] ) {
            for ((userId, user) in values.vals()) {
                users.put(userId, user);
            }
        }
    }
}
