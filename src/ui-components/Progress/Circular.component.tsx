import MUICircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';

import { constants } from 'lib/constants';

export const CircularProgress = ({ size = constants.CIRCULAR_PROGRESS_SIZE, ...props }: CircularProgressProps) => {
	return <MUICircularProgress size={size} {...props} />;
};
