import Time "mo:base/Time"

module {
    public type UserId = Principal;

    public type Profile = {
        userId: UserId;
        createdAt: Time.Time;
    };
}
