import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { PropsWithChildren } from 'react';

import { AlertProps } from './Alert.types';

export const Alert = ({ title, severity = 'info', children }: PropsWithChildren<AlertProps>) => {
	return (
		<MuiAlert severity={severity}>
			{title ? <AlertTitle>Error</AlertTitle> : null}
			{children}
		</MuiAlert>
	);
};
