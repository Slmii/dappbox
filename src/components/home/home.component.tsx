import { useContext, useEffect, useState } from 'react';

import { ViewList } from 'components/view-list';
import { AuthContext } from 'lib/context';
import { Profile } from 'lib/generated/dappbox_types';
import { Box } from 'ui-components/box';

export const Home = () => {
	const { actor } = useContext(AuthContext);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [isProfileLoading, setIsProfileLoading] = useState(false);

	useEffect(() => {
		const initProfile = async () => {
			setIsProfileLoading(true);

			if (actor) {
				const profile = await actor.getUser();

				if ('ok' in profile) {
					setProfile(profile.ok);
				} else {
					const profile = await actor.createUser();
					if ('ok' in profile) {
						setProfile(profile.ok);
					} else {
						console.error(profile.err);
					}
				}
			}

			setIsProfileLoading(false);
		};

		initProfile();
	}, [actor]);

	return (
		<Box
			sx={{
				position: 'relative',
				height: 'calc(100% - 65px)'
			}}
		>
			{isProfileLoading ? <>Setting up your account</> : profile ? <ViewList /> : null}
		</Box>
	);
};
