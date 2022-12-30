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
					minHeight: 56
				}}
			>
				<Column>
					<Icon icon={getIcon(activity.type)} color='inherit' />
					<Caption>{activity.name}</Caption>
				</Column>
				<Column>
					{activity.onUndo && !activity.inProgress && activity.progress === 100 ? (
						<Button label='Undo' onClick={activity.onUndo} />
					) : null}
					{activity.href && !activity.inProgress && activity.progress === 100 ? (
						<Button label='View' onClick={() => activity.href && navigate(activity.href)} />
					) : null}
					<IconButton icon='close' label='Clear' onClick={() => onRemove(activity.id)} color='inherit' />
				</Column>
			</Box>
			{activity.inProgress ? (
				<LinearProgress
					variant={
						typeof activity.progress !== 'undefined' && activity.progress !== 100
							? 'determinate'
							: 'indeterminate'
					}
					value={activity.progress ?? undefined}
				/>
			) : null}
			<Divider />
		</>
	);
};
