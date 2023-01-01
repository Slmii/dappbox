import Badge from '@mui/material/Badge';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';

import { constants } from 'lib/constants';
import { ActivityType } from 'lib/types';
import { Box, Column } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Divider } from 'ui-components/Divider';
import { Icon } from 'ui-components/Icon';
import { IconButton } from 'ui-components/IconButton';
import { Icons } from 'ui-components/icons';
import { Tooltip } from 'ui-components/Tooltip';
import { Caption } from 'ui-components/Typography';
import { ActivityProps } from './Activity.types';

export const Activity = ({ activity, onRemove }: ActivityProps) => {
	const navigate = useNavigate();

	const getIcon = (type: ActivityType): Icons => {
		if (type === 'delete') {
			return 'deleteOutlined';
		}

		if (type === 'download') {
			return 'downloadOutlined';
		}

		if (type === 'folder') {
			return 'uploadFolder';
		}

		if (type === 'move') {
			return 'folderMoveOutlined';
		}

		if (type === 'rename') {
			return 'editOutlined';
		}

		if (type === 'favorite-add') {
			return 'favorite';
		}

		if (type === 'favorite-remove') {
			return 'favoriteOutlined';
		}

		return 'uploadFile';
	};

	return (
		<>
			<Box
				sx={{
					padding: constants.SPACING,
					paddingTop: constants.SPACING / 2,
					paddingBottom: constants.SPACING / 2,
					display: 'flex',
					justifyContent: 'space-between',
					minHeight: constants.ACTIVITIES.ITEM
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						columnGap: constants.SPACING,
						// Calculate the width based on the activity's state, in order to get correct ellipses
						width: activity.isFinished && activity.onUndo ? '55%' : activity.inProgress ? '85%' : '75%'
					}}
				>
					<Tooltip label={activity.isFinished ? 'Done' : activity.inProgress ? 'In progress' : 'In queue'}>
						<Badge variant='dot' color={activity.isFinished ? 'success' : 'warning'} />
					</Tooltip>
					<Icon icon={getIcon(activity.type)} color='inherit' fontSize='small' />
					<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
						<Caption noWrap>{activity.name}</Caption>
						{activity.newFolder ? (
							<Box
								component='span'
								sx={{
									fontSize: 10,
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									color: theme => theme.palette.text.primary
								}}
							>
								{activity.inProgress ? (
									<>
										Moving to: <b>{activity.newFolder}</b>
									</>
								) : (
									<>
										Moved to: <b>{activity.newFolder}</b>
									</>
								)}
							</Box>
						) : null}
						{activity.oldName ? (
							<Box
								component='span'
								sx={{
									fontSize: 10,
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									color: theme => theme.palette.text.primary
								}}
							>
								{activity.inProgress ? (
									<>
										Renaming from: <b>{activity.oldName}</b>
									</>
								) : (
									<>
										Renamed from: <b>{activity.oldName}</b>
									</>
								)}{' '}
							</Box>
						) : null}
					</Box>
				</Box>
				<Column spacing={0}>
					{activity.onUndo && activity.isFinished ? (
						<Button label='Undo' onClick={() => activity.onUndo?.(activity)} />
					) : null}
					{activity.href && activity.isFinished ? (
						<Button label='View' onClick={() => activity.href && navigate(activity.href)} />
					) : null}
					{activity.isFinished ? (
						<IconButton icon='close' label='Clear' onClick={() => onRemove(activity.id)} color='inherit' />
					) : null}
				</Column>
			</Box>
			{activity.inProgress ? <LinearProgress variant='indeterminate' /> : null}
			<Divider />
		</>
	);
};
