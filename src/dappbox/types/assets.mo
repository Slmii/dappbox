import Time "mo:base/Time";
import Hash "mo:base/Hash";

module {
    public type UserId = Principal;

    public type Folder = {
        folderId: Text;
        userId: UserId;
        name: Text;
        isFavorite: Bool;
        createdAt: Time.Time;
    };

    public type File = {
        fileId: Text;
        userId: UserId;
        folderId: ?Text;
        name: Text;
        size: Nat;
        extension: Text;
        mimeType: Text;
        isFavorite: Bool;
        createdAt: Time.Time;
    };
}
