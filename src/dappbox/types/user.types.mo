import Time "mo:base/Time"

module {
    public type UserId = Principal;

    public type User = {
        userId: UserId;
        createdAt: Time.Time;
    };
}
