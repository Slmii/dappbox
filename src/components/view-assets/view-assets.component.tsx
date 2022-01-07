import { useContext, useEffect, useState } from 'react';

import { AuthContext } from 'lib/context';
import { User } from 'lib/generated/dappbox_types';
import { useTableAssets } from 'lib/hooks';
import { Box } from 'ui-components/box';
import { Column, Table } from 'ui-components/table';

const columns: Column = {
	name: {
		alignment: 'left',
		label: 'Name',
		sortable: true,
		type: 'string'
	},
	isFavorite: {
		alignment: 'left',
		label: 'Favorite',
		sortable: true,
		type: 'icon',
		icon: 'favorite',
		iconAlt: 'favoriteOutlined'
	},
	extension: {
		alignment: 'left',
		label: 'Extension',
		sortable: true,
		type: 'string'
	},
	size: {
		alignment: 'left',
		label: 'Size',
		sortable: true,
		type: 'bigint'
	}
};

export const ViewAssets = () => {
	const { actor } = useContext(AuthContext);
	const [profile, setProfile] = useState<User | null>(null);
	const [isProfileLoading, setIsProfileLoading] = useState(false);

	const { tableAssets, ...tableState } = useTableAssets();

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
				height: '100%'
			}}
		>
			{isProfileLoading ? (
				<>Setting up your account</>
			) : profile ? (
				<Table {...tableState} rows={tableAssets} columns={columns} />
			) : null}
		</Box>
	);
};
