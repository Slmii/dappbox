import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React, { PropsWithChildren } from 'react';

import { SPACING } from 'lib/constants/spacing.constants';
import { Button } from 'ui-components/Button';
import { DialogProps } from './Dialog.types';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />;
});

export const Dialog = ({
	open,
	title,
	text,
	onClose,
	onConfirmText,
	onCancelText,
	onConfirmDisabled,
	onConfirmLoading,
	onCancelDisabled,
	onConfirm,
	children
}: PropsWithChildren<DialogProps>) => {
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
							paddingTop: SPACING
						}}
					>
						{text}
					</DialogContentText>
				)}
				{children}
			</DialogContent>
			<DialogActions>
				<Button label={onCancelText ?? 'Cancel'} onClick={onClose} disabled={onCancelDisabled} size='large' />
				<Button
					label={onConfirmText ?? 'Confirm'}
					onClick={onConfirm}
					loading={onConfirmLoading}
					disabled={onConfirmDisabled}
					size='large'
				/>
			</DialogActions>
		</MuiDialog>
	);
};
