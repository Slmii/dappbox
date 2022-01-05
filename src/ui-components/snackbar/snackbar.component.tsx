import Slide, { SlideProps } from '@mui/material/Slide';
import MuiSnackbar from '@mui/material/Snackbar';
import React from 'react';

import { Button } from 'ui-components/button';
import { IconButton } from 'ui-components/icon-button';
import { SnackbarProps } from './snackbar.types';

const autoHideDuration = 5000;

type TransitionProps = Omit<SlideProps, 'direction'>;

function Transition(props: TransitionProps) {
	return <Slide {...props} direction='right' />;
}

export const Snackbar = ({ open, message, persist = false, onClose, onUndo }: SnackbarProps) => {
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
							color='inherit'
							variant='text'
							label='UNDO'
							size='small'
							onClick={() => {
								onUndo?.();
								onClose?.();
							}}
						/>
					)}
					{onClose && (
						<IconButton icon='close' label='Close' color='inherit' size='small' onClick={onClose} />
					)}
				</>
			}
		/>
	);
};
