import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

import { Button } from 'ui-components/button';
import { DialogProps } from './dialog.types';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />;
});

export const Dialog: React.FC<DialogProps> = ({ open, title, onClose, onConfirm, children }) => {
	return (
		<MuiDialog
			open={open}
			onClose={onClose}
			aria-labelledby='dialog-title'
			aria-describedby='dialog-description'
			TransitionComponent={Transition}
			fullWidth
		>
			<DialogTitle id='dialog-title'>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<DialogActions>
				<Button label='Cancel' onClick={onClose} />
				<Button label='Confirm' onClick={onConfirm} />
			</DialogActions>
		</MuiDialog>
	);
};
