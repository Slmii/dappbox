export interface DialogProps {
	title: string;
	text?: string;
	open: boolean;
	onConfirmText?: string;
	onCancelText?: string;
	onConfirmDisabled?: boolean;
	onCancelDisabled?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}
