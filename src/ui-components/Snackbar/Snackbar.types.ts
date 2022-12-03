export interface SnackbarProps {
	open: boolean;
	message: string | JSX.Element;
	persist?: boolean;
	onClose?: () => void;
	onUndo?: () => void | Promise<void>;
	isOnUndoLoading?: boolean;
	loader?: boolean;
}
