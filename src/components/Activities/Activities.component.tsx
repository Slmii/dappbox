import Paper from '@mui/material/Paper';

import { constants } from 'lib/constants';
import { useActivities } from 'lib/hooks';
import { Box, Column } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Icon } from 'ui-components/Icon';
import { SubTitle } from 'ui-components/Typography';
import { Activity } from './Activity.component';

export const Activities = () => {
	const {
		open,
		setOpen,
		activities: { activities },
		removeActivity,
		removeAllActivities
	} = useActivities();

	return (
		<Paper
			elevation={10}
			sx={{
				borderRadius: 0,
				color: theme => theme.palette.secondary.contrastText,
				position: 'absolute',
				bottom: 0,
				right: 0,
				width: constants.ACTIVITIES_WIDTH,
				height: open ? constants.ACTIVITIES_HEIGHT : constants.ACTIVITIES_HEIGHT_COLLAPSED,
				transition: 'height 0.25s ease',
				zIndex: 2
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					cursor: 'pointer',
					minHeight: constants.ACTIVITIES_HEIGHT_COLLAPSED,
					paddingLeft: constants.SPACING,
					paddingRight: constants.SPACING,
					borderTopLeftRadius: theme => theme.shape.borderRadius,
					backgroundColor: theme => theme.palette.secondary.main
				}}
				onClick={() => setOpen(!open)}
			>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<SubTitle>Activities</SubTitle>&nbsp;
					{activities.length ? <SubTitle>({activities.length})</SubTitle> : null}
				</Box>
				<Column>
					{activities.length ? (
						<Button
							label='Clear all'
							size='small'
							color='inherit'
							onClick={e => {
								e.stopPropagation();
								removeAllActivities();
							}}
						/>
					) : null}
					<Icon icon={open ? 'expandMore' : 'expandLess'} />
				</Column>
			</Box>
			<Box
				sx={{
					maxHeight: constants.ACTIVITIES_HEIGHT - constants.ACTIVITIES_HEIGHT_COLLAPSED,
					overflowY: 'auto',
					borderLeft: theme => `1px solid ${theme.palette.divider}`
				}}
			>
				{activities.map(activity => (
					<Activity key={activity.id} activity={activity} onRemove={removeActivity} />
				))}
			</Box>
		</Paper>
	);
};
