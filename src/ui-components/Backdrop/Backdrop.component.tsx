import MUIBackdrop from '@mui/material/Backdrop';
import { PropsWithChildren } from 'react';

export const Backdrop = ({ open, onClick, children }: PropsWithChildren<{ open: boolean; onClick: () => void }>) => {
	return (
		<MUIBackdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open} onClick={onClick}>
			{children}
		</MUIBackdrop>
	);
};
