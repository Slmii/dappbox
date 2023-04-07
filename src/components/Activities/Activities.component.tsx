import Paper from '@mui/material/Paper';
import { useState } from 'react';

import { Resizeable } from 'components/Resizable';
import { ACTIVITY_HEIGHT, ACTIVITY_HEIGHT_COLLAPSED, ACTIVITY_WIDTH } from 'lib/constants/activitites.consants';
import { SPACING } from 'lib/constants/spacing.constants';
import { useActivities } from 'lib/hooks';
import { Box, Column } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { IconButton } from 'ui-components/IconButton';
import { SubTitle } from 'ui-components/Typography';
import { Activity } from './Activity.component';

export const Activities = () => {
	const [height, setHeight] = useState(ACTIVITY_HEIGHT);
	const [isFullScreen, setIsFullScreen] = useState(false);
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
				zIndex: theme => theme.zIndex.tooltip
			}}
		>
			<Resizeable
				width={ACTIVITY_WIDTH}
				height={open ? height : ACTIVITY_HEIGHT_COLLAPSED}
				isDraggable={open && !isFullScreen}
				fullScreen={isFullScreen}
				onResize={height => setHeight(height)}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						minHeight: ACTIVITY_HEIGHT_COLLAPSED,
						paddingLeft: SPACING,
						paddingRight: SPACING,
						borderTopLeftRadius: !isFullScreen ? theme => theme.shape.borderRadius : undefined,
						backgroundColor: theme => theme.palette.secondary.main
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
							cursor: !isFullScreen ? 'pointer' : undefined,
							userSelect: 'none'
						}}
						onClick={() => !isFullScreen && setOpen(!open)}
					>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<SubTitle>Activities</SubTitle>&nbsp;
							{activities.length ? <SubTitle>({activities.length})</SubTitle> : null}
						</Box>
						<Column spacing={0}>
							{open && activities.length ? (
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
							<IconButton
								size='small'
								label={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
								icon={isFullScreen ? 'fullScreenExit' : 'fullScreen'}
								color='inherit'
								onClick={e => {
									e.stopPropagation();
									setOpen(true);
									setIsFullScreen(prevState => !prevState);
								}}
							/>
							{!isFullScreen ? (
								<IconButton
									size='small'
									label={open ? 'Close' : 'Open'}
									icon={open ? 'expandMore' : 'expandLess'}
									color='inherit'
								/>
							) : null}
						</Column>
					</Box>
				</Box>
				<Paper
					elevation={10}
					sx={{
						maxHeight: isFullScreen
							? // Fullscreen height
							  window.innerHeight - ACTIVITY_HEIGHT_COLLAPSED
							: // Current height of the resizable component
							  height - ACTIVITY_HEIGHT_COLLAPSED,
						height: open ? '100%' : 0,
						overflowY: 'auto',
						border: 0,
						borderLeft: theme => `1px solid ${theme.palette.divider}`,
						borderRadius: 0
					}}
				>
					{activities.map(activity => (
						<Activity
							key={activity.id}
							activity={activity}
							onRemove={removeActivity}
							onClose={
								activity.type === 'folder'
									? () => {
											setOpen(false);
											setIsFullScreen(false);
									  }
									: undefined
							}
						/>
					))}
				</Paper>
			</Resizeable>
		</Paper>
	);
};
