import MUICircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';

import { CIRCULAR_PROGRESS_SIZE } from 'lib/constants/sizes.constants';

export const CircularProgress = ({ size = CIRCULAR_PROGRESS_SIZE, ...props }: CircularProgressProps) => {
	return <MUICircularProgress size={size} {...props} />;
};
