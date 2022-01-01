import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

import ProfileTypes "./types/profile";
import AssetsTypes "./types/assets";
import User "./user";

actor DappBox {
    type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
    };

    type UserId = ProfileTypes.UserId;
    type Profile = ProfileTypes.Profile;
    type Folder = AssetsTypes.Folder;
    type File = AssetsTypes.File;

    let user = User.User();

    stable var users: [(UserId, Profile)] = [];
    stable var folders: [(UserId, Folder)] = [];
    stable var files: [(UserId, File)] = [];
    stable var usersCount : Nat = 0;

    public query(msg) func getUser(): async Result.Result<Profile, Error> {
        let callerId = msg.caller;

        // Reject AnonymousIdentity
        if (Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let result = user.getUser(callerId);

        return Result.fromOption(result, #NotFound);
    };  

    public shared(msg) func createUser(): async Result.Result<Profile, Error> {
        let callerId = msg.caller;

        // Reject AnonymousIdentity
        if (Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let result = user.getUser(callerId);
        switch(result) {
            case null {
                // Create profile
                let createdProfile = user.createUser(callerId);

                // Increment user count
                usersCount := usersCount + 1;

                #ok(createdProfile);
            };
            case(?profile) {
                #err(#AlreadyExists);
            };
        };
    };
    
    system func preupgrade() {
        let results = user.getUsers();
        users := results;
    };

    system func postupgrade() {
        users := [];
        folders := [];
        files := [];
    };
}
