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

import UserTypes "./types/user.types";
import AssetTypes "./types/assets.types";
import User "./user";
import Asset "./asset";

shared(msg) actor class DappBox() {
    type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
    };

    // TODO: use for only admin calls
    // let admin = msg.caller;

    type UserId = UserTypes.UserId;
    type User = UserTypes.User;
    type AssetId = AssetTypes.AssetId;
    type AssetUser = AssetTypes.AssetUser;
    type Asset = AssetTypes.Asset;

    let userClass = User.UserClass();
    let assetClass = Asset.AssetClass();

    stable var users: [(UserId, User)] = [];
    stable var assets: [(AssetUser, Asset)] = [];
    stable var usersCount : Nat = 0;

    // User functions
    public query(msg) func getUser(): async Result.Result<User, Error> {
        let callerId = msg.caller;

        // Reject AnonymousIdentity
        if (Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let result = userClass.getUser(callerId);

        return Result.fromOption(result, #NotFound);
    };  

    public shared(msg) func createUser(): async Result.Result<User, Error> {
        let callerId = msg.caller;

        // Reject AnonymousIdentity
        if (Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let result = userClass.getUser(callerId);
        switch(result) {
            case null {
                // Create profile
                let createdUser = userClass.createUser(callerId);

                // Increment user count
                usersCount := usersCount + 1;

                #ok(createdUser);
            };
            case(?profile) {
                #err(#AlreadyExists);
            };
        };
    };

    // Asset functions
    public query(msg) func getAssets(): async Result.Result<[Asset], Error> {
        let callerId = msg.caller;

        // Reject AnonymousIdentity
        if (Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        #ok(assetClass.getUserAssets(callerId));
    };  
    
    system func preupgrade() {
        let usersData = userClass.getUsers();
        users := usersData;

        let assetsData = assetClass.getAssets();
        assets := assetsData;
    };

    system func postupgrade() {
        userClass.rePopulateHashmap(users);
        assetClass.rePopulateHashmap(assets);
        
        users := [];
        assets := [];
    };
}
