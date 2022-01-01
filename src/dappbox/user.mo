import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";

import ProfileTypes "./types/profile";

module {
    type Profile = ProfileTypes.Profile;
    type UserId = ProfileTypes.UserId;

    func isPrincipalIdEqual(x: UserId, y: UserId): Bool { 
        return x == y; 
    };

    public class User() {
        public let profiles = Map.HashMap<UserId, Profile>(1, isPrincipalIdEqual, Principal.hash);

        public func createUser(userId: UserId): Profile {
            let profile: Profile = {
                userId = userId;
                createdAt = Time.now();
            };

            profiles.put(
                userId,
                profile
            );

            return profile;
        };

        public func getUser(userId: UserId): ?Profile {
            return profiles.get(userId);
        };

        public func getUsers(): [(UserId, Profile)] {
            return Iter.toArray(profiles.entries())
        };
    }
}
