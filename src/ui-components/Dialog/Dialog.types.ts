export interface DialogProps {
	title: string;
	text?: string;
	open: boolean;
	onConfirmText?: string;
	onCancelText?: string;
	onConfirmDisabled?: boolean;
	onConfirmLoading?: boolean;
	onCancelDisabled?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}
