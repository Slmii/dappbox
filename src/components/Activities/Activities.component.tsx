import Paper from '@mui/material/Paper';
import React, { useState } from 'react';

import { constants } from 'lib/constants';
import { useActivities } from 'lib/hooks';
import { Box } from 'ui-components/Box';
import { Icon } from 'ui-components/Icon';
import { SubTitle } from 'ui-components/Typography';
import { Activity } from './Activity.component';

export const Activities = () => {
	const [open, setOpen] = useState(false);
	const { activities, removeActivity } = useActivities();

	return (
		<Paper
			elevation={10}
			sx={{
				borderRadius: 0,
				borderTopLeftRadius: theme => theme.shape.borderRadius,
				backgroundColor: theme => theme.palette.secondary.main,
				color: theme => theme.palette.secondary.contrastText,
				position: 'absolute',
				bottom: open ? constants.ACTIVITIES_HEIGHT : 0,
				right: 0,
				width: 400,
				transition: 'bottom 0.25s ease'
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					cursor: 'pointer',
					padding: constants.SPACING,
					paddingTop: constants.SPACING / 2,
					paddingBottom: constants.SPACING / 2
				}}
				onClick={() => setOpen(!open)}
			>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<SubTitle>Activities</SubTitle>&nbsp;
					{activities.activities.length ? <SubTitle>({activities.activities.length})</SubTitle> : null}
				</Box>
				<Icon icon={open ? 'expandMore' : 'expandLess'} />
			</Box>
			<Paper
				elevation={10}
				sx={{
					position: 'absolute',
					top: '100%',
					left: 0,
					width: '100%',
					height: !open ? 0 : constants.ACTIVITIES_HEIGHT,
					borderLeft: theme => `1px solid ${theme.palette.divider}`,
					overflowY: 'auto',
					borderRadius: 0
				}}
			>
				{activities.activities.map(activity => (
					<Activity key={activity.id} activity={activity} onRemove={removeActivity} />
				))}
			</Paper>
		</Paper>
	);
};
