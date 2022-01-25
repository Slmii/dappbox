import Time "mo:base/Time";
import Hash "mo:base/Hash";

import UserTypes "./user.types";

module {
    public type AssetId = Hash.Hash;
    type UserId = UserTypes.UserId;

    public type Asset = {
        assetId: AssetId;
        userId: UserId;
        parentId: ?AssetId;
        assetType: Text;
        name: Text;
        isFavorite: Bool;
        size: ?Nat32;
        extension: ?Text;
        mimeType: ?Text;
        createdAt: Time.Time;
    };

    public type AssetUser = (AssetId, UserId);
}
