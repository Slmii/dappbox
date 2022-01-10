export interface DialogProps {
	title: string;
	open: boolean;
	onConfirm: () => void;
	onClose: () => void;
}
