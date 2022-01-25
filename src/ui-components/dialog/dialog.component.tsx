import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

import { constants } from 'lib/constants';
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

export const Dialog: React.FC<DialogProps> = ({
	open,
	title,
	text,
	onClose,
	onConfirmText,
	onCancelText,
	onConfirmDisabled,
	onCancelDisabled,
	onConfirm,
	children
}) => {
	return (
		<MuiDialog
			open={open}
			onClose={onClose}
			aria-labelledby='dialog-title'
			aria-describedby='dialog-description'
			TransitionComponent={Transition}
			fullWidth
		>
			<DialogTitle
				id='dialog-title'
				sx={{
					paddingBottom: 0
				}}
			>
				{title}
			</DialogTitle>
			<DialogContent>
				{text && (
					<DialogContentText
						sx={{
							paddingTop: constants.SPACING
						}}
					>
						{text}
					</DialogContentText>
				)}
				{children}
			</DialogContent>
			<DialogActions>
				<Button label={onCancelText ?? 'Cancel'} onClick={onClose} disabled={onCancelDisabled} />
				<Button label={onConfirmText ?? 'Confirm'} onClick={onConfirm} disabled={onConfirmDisabled} />
			</DialogActions>
		</MuiDialog>
	);
};
