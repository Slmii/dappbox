import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from 'lib/context';
import { Profile } from 'lib/generated/dappbox_types';
import { Box, RowBox } from 'ui-components/box';

export const Home = () => {
	const { principal, actor } = useContext(AuthContext);
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
					console.log(profile.err);
					// const profile = await actor.createUser();
					// if ('ok' in profile) {
					// 	setProfile(profile.ok);
					// } else {
					// 	console.error(profile.err);
					// }
				}
			}

			setIsProfileLoading(false);
		};

		initProfile();
	}, [actor]);

	return (
		<Box
			sx={{
				position: 'relative'
			}}
		>
			<RowBox>
				<Typography variant='h5' component='h2' gutterBottom>
					You are authenticated
				</Typography>
				<Typography variant='subtitle1' gutterBottom>
					{principal ? principal.toText() : ''}
				</Typography>
				{isProfileLoading ? (
					<>Setting up your account</>
				) : profile ? (
					<Box>{JSON.stringify(profile)}</Box>
				) : (
					<>
						<Typography variant='body1'>
							It seems that you do not have a profile on DappBox. Press the button below to create one
							with your PrincipalID.
						</Typography>
					</>
				)}
			</RowBox>
		</Box>
	);
};
