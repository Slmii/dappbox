import Slide, { SlideProps } from '@mui/material/Slide';
import MuiSnackbar from '@mui/material/Snackbar';

import { SPACING } from 'lib/constants/spacing.constants';
import { Button } from 'ui-components/Button';
import { IconButton } from 'ui-components/IconButton';
import { CircularProgress } from 'ui-components/Progress';
import { SnackbarProps } from './Snackbar.types';

const autoHideDuration = 5000;

type TransitionProps = Omit<SlideProps, 'direction'>;

function Transition(props: TransitionProps) {
	return <Slide {...props} direction='right' />;
}

export const Snackbar = ({
	open,
	message,
	persist = false,
	onClose,
	onUndo,
	isOnUndoLoading,
	loader
}: SnackbarProps) => {
	return (
		<MuiSnackbar
			TransitionComponent={Transition}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left'
			}}
			open={open}
			autoHideDuration={!persist ? autoHideDuration : undefined}
			onClose={(_event, reason) => {
				if (reason === 'clickaway') {
					return;
				}

				onClose?.();
			}}
			message={message}
			action={
				<>
					{onUndo && (
						<Button
							type='button'
							color='info'
							variant='text'
							label='UNDO'
							size='small'
							loading={isOnUndoLoading}
							onClick={async () => {
								await onUndo?.();
								onClose?.();
							}}
						/>
					)}
					{onClose && (
						<IconButton icon='close' label='Close' color='inherit' size='small' onClick={onClose} />
					)}
					{loader ? (
						<CircularProgress
							sx={{
								marginRight: SPACING
							}}
						/>
					) : null}
				</>
			}
		/>
	);
};
