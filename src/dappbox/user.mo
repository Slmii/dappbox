import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";

import UserTypes "./types/user.types";

module {
    type UserId = UserTypes.UserId;
    type User = UserTypes.User;

    func isPrincipalIdEqual(x: UserId, y: UserId): Bool { 
        return x == y; 
    };

    public class UserClass() {
        public let users = Map.HashMap<UserId, User>(1, isPrincipalIdEqual, Principal.hash);

        public func createUser(userId: UserId): User {
            let user: User = {
                userId = userId;
                createdAt = Time.now();
            };

            users.put(userId, user);

            return user;
        };

        public func getUser(userId: UserId): ?User {
            return users.get(userId);
        };

        public func getUsers(): [(UserId, User)] {
            let array = Iter.toArray(users.entries())
        };

        public func rePopulateHashmap(values: [(UserId, User)] ) {
            for ((userId, user) in values.vals()) {
                users.put(userId, user);
            }
        }
    }
}
