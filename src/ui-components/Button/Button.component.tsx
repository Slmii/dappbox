import MuiButton from '@mui/material/Button';

import { SPACING } from 'lib/constants/spacing.constants';
import { icons } from 'ui-components/icons';
import { CircularProgress } from 'ui-components/Progress';
import { Tooltip } from 'ui-components/Tooltip';
import { CustomButtonProps } from './Button.types';

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
					sx={{
						marginRight: label ? SPACING : 0
					}}
				/>
			) : null}
			{label ? label : null}
		</MuiButton>
	);

	return (
		<>
			{tooltip ? (
				<Tooltip label={tooltip}>{props.disabled ? <span>{button}</span> : button}</Tooltip>
			) : (
				<>{button}</>
			)}
		</>
	);
};
