import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Debug "mo:base/Debug";

import AssetTypes "./types/assets.types";
import UserTypes "./types/user.types";

module {
    type AssetUser = AssetTypes.AssetUser;
    type Asset = AssetTypes.Asset;
    type AssetId = AssetTypes.AssetId;
    type UserId = UserTypes.UserId;

    func isPrincipalIdEqual(x: AssetUser, y: AssetUser): Bool { 
        return x == y; 
    };

    public class AssetClass() {
        public let assets = Map.HashMap<AssetUser, Asset>(1, isPrincipalIdEqual, func((assetId: AssetId, userId : UserId)) { Principal.hash(userId) & assetId });

        public func getAsset(assetId: AssetId, userId: UserId): ?Asset {
            return assets.get((assetId, userId));
        };

        public func getAssets(): [(AssetUser, Asset)] {
            return Iter.toArray(assets.entries());
        };

        public func getUserAssets(userId: UserId): [Asset] {
            let userAssets = Buffer.Buffer<Asset>(0);

            for (((aId, uId), asset) in getAssets().vals()) {
                if (Principal.equal(uId, userId)) {
                    userAssets.add(asset);
                }   
            };

            return userAssets.toArray();
        };

        public func rePopulateHashmap(values: [(AssetUser, Asset)] ) {
            for (((aId, uId), asset) in values.vals()) {
                assets.put((aId, uId),asset);
            }
        }
    }
}
