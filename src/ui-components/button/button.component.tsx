import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

import { icons } from 'ui-components/icons';
import { CustomButtonProps } from './button.types';

export const Button = ({
	tooltip,
	label,
	loading,
	startIcon,
	endIcon,
	startImage,
	endImage,
	...props
}: CustomButtonProps) => {
	const StartIcon = icons[startIcon as keyof typeof icons];
	const EndIcon = icons[endIcon as keyof typeof icons];

	const button = (
		<MuiButton
			{...props}
			disabled={props.disabled || loading}
			startIcon={
				!loading ? (
					startIcon ? (
						<StartIcon />
					) : startImage ? (
						<img src={startImage} alt='' width={20} />
					) : undefined
				) : undefined
			}
			endIcon={
				!loading ? (
					endIcon ? (
						<EndIcon />
					) : endImage ? (
						<img src={endImage} alt='' width={20} />
					) : undefined
				) : undefined
			}
		>
			{loading ? (
				<CircularProgress
					size={24}
					sx={{
						marginRight: label ? 1 : 0
					}}
				/>
			) : null}
			{label ? label : null}
		</MuiButton>
	);

	return (
		<>
			{tooltip ? (
				<Tooltip arrow title={tooltip}>
					{button}
				</Tooltip>
			) : (
				<>{button}</>
			)}
		</>
	);
};
