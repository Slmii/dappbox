
    // system func preupgrade() {
    //     profileEntries := Iter.toArray(profiles.entries());
    // };

    // system func postupgrade() {
    //     profileEntries := [];
    // };

   

    // Application interface


    // // Create a profile
    // public shared(msg) func create (profile: ProfileUpdate) : async Result.Result<(), Error> {
    //     // Get caller principal
    //     let callerId = msg.caller;

    //     // Reject AnonymousIdentity
    //     if(Principal.toText(callerId) == "2vxsx-fae") {
    //         return #err(#NotAuthorized);
    //     };

    //     // Associate user profile with their principal
    //     let userProfile: Profile = {
    //         bio = profile.bio;
    //         image = profile.image;
    //         id = callerId;
    //     };

    //     let (newProfiles, existing) = Trie.put(
    //         profiles,           // Target trie
    //         key(callerId),      // Key
    //         Principal.equal,    // Equality checker
    //         userProfile
    //     );

    //     // If there is an original value, do not update
    //     switch(existing) {
    //         // If there are no matches, update profiles
    //         case null {
    //             profiles := newProfiles;
    //             #ok(());
    //         };
    //         // Matches pattern of type - opt Profile
    //         case (? v) {
    //             #err(#AlreadyExists);
    //         };
    //     };
    // };

    // Read profile
    // public query(msg) func read () : async Result.Result<Profile, Error> {
    //     // Get caller principal
    //     let callerId = msg.caller;

    //     Debug.print(Principal.toText(callerId));

    //     // Reject AnonymousIdentity
    //     if(Principal.toText(callerId) == "2vxsx-fae") {
    //         return #err(#NotAuthorized);
    //     };

    //     let result = Trie.find(
    //         profiles,           //Target Trie
    //         key(callerId),      // Key
    //         Principal.equal     // Equality Checker
    //     );
        
    //     return Result.fromOption(result, #NotFound);
    // };


    // private func key(x : Principal) : Trie.Key<Principal> {
    //     return { key = x; hash = Principal.hash(x) }
    // };
