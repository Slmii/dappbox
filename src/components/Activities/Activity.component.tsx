import Badge from '@mui/material/Badge';
import LinearProgress from '@mui/material/LinearProgress';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import { ACTIVITY_ITEM } from 'lib/constants/activitites.consants';
import { SPACING } from 'lib/constants/spacing.constants';
import { Activity as IActivity, ActivityType } from 'lib/types';
import { Box, Column } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Divider } from 'ui-components/Divider';
import { Icon } from 'ui-components/Icon';
import { IconButton } from 'ui-components/IconButton';
import { Icons } from 'ui-components/icons';
import { Tooltip } from 'ui-components/Tooltip';
import { Caption } from 'ui-components/Typography';
import { ActivityProps } from './Activity.types';

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

const getWidth = (activity: IActivity) => {
	if (activity.isFinished && activity.onUndo) {
		if (activity.type === 'download') {
			return '45%';
		}

		return '55%';
	}

	if (activity.inProgress) {
		return '85%';
	}

	return '75%';
};

const getTooltipLabel = (activity: IActivity) => {
	if (activity.error) {
		return 'Error';
	}

	if (activity.isFinished) {
		return 'Finshed';
	}

	if (activity.inProgress) {
		return 'In progress';
	}

	return 'In queue';
};

export const Activity = ({ activity, onRemove, onClose }: ActivityProps) => {
	const navigate = useNavigate();

	return (
		<>
			<Box
				sx={{
					padding: SPACING,
					paddingTop: SPACING / 2,
					paddingBottom: SPACING / 2,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					minHeight: ACTIVITY_ITEM
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						columnGap: SPACING,
						// Calculate the width based on the activity's state, in order to get correct ellipses
						width: getWidth(activity)
					}}
				>
					<Tooltip label={getTooltipLabel(activity)}>
						<Badge
							variant='dot'
							color={
								activity.error
									? 'error'
									: activity.isFinished
									? 'success'
									: activity.inProgress
									? 'secondary'
									: 'warning'
							}
						/>
					</Tooltip>
					<Box
						sx={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center'
						}}
					>
						<Icon icon={getIcon(activity.type)} color='inherit' fontSize='small' />
						{activity.isUndo ? (
							<Box
								sx={{
									position: 'absolute',
									top: -10,
									right: -5,
									fontSize: 14
								}}
							>
								<Icon icon='undo' color='action' fontSize='inherit' sx={{ zIndex: 2 }} />
							</Box>
						) : null}
					</Box>
					<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
						<Caption noWrap>{activity.name}</Caption>
						{activity.error ? (
							<SubText color='error'>
								Error: <b>{activity.error}</b>
							</SubText>
						) : (
							<>
								{activity.newFolder ? (
									<SubText>
										{activity.inProgress ? (
											<>
												Moving to: <b>{activity.newFolder}</b>
											</>
										) : (
											<>
												Moved to: <b>{activity.newFolder}</b>
											</>
										)}
									</SubText>
								) : null}
								{activity.oldName ? (
									<SubText>
										{activity.inProgress ? (
											<>
												Renaming from: <b>{activity.oldName}</b>
											</>
										) : (
											<>
												Renamed from: <b>{activity.oldName}</b>
											</>
										)}
									</SubText>
								) : null}
							</>
						)}
					</Box>
				</Box>
				<Column spacing={0}>
					{!activity.error ? (
						<>
							{activity.onUndo && activity.isFinished ? (
								<Button
									label={activity.type === 'download' ? 'Download' : 'Undo'}
									onClick={() => activity.onUndo?.(activity)}
								/>
							) : null}
							{activity.href && activity.isFinished ? (
								<Button
									label='View'
									onClick={() => {
										activity.href && navigate(activity.href);
										onClose?.();
									}}
								/>
							) : null}
						</>
					) : null}
					{activity.isFinished || activity.error ? (
						<IconButton icon='close' label='Clear' onClick={() => onRemove(activity.id)} color='inherit' />
					) : null}
				</Column>
			</Box>
			{activity.inProgress ? (
				<Box
					sx={{
						position: 'relative'
					}}
				>
					<LinearProgress
						sx={{
							width: typeof activity.totalChunks !== 'undefined' ? '87.5%' : undefined
						}}
						variant='indeterminate'
					/>
					{typeof activity.totalChunks !== 'undefined' ? (
						<Box
							sx={{
								position: 'absolute',
								right: 10,
								bottom: -5
							}}
						>
							<Caption>
								{activity.currentChunk}/{activity.totalChunks}
							</Caption>
						</Box>
					) : null}
				</Box>
			) : null}
			<Divider />
		</>
	);
};

const SubText = ({ children, color = 'primary' }: PropsWithChildren<{ color?: 'primary' | 'error' }>) => {
	return (
		<Box
			component='span'
			sx={{
				fontSize: 10,
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				color: theme => (color === 'primary' ? theme.palette.text.primary : theme.palette.error.main)
			}}
		>
			{children}
		</Box>
	);
};
