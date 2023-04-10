import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Icon } from 'ui-components/Icon';
import { IconButton } from 'ui-components/IconButton';
import { FieldProps, StandaloneFieldProps } from './Field.types';

/**
 * @description Field as the stardard input field on a form
 */
export const Field = ({
	name,
	label,
	type = 'text',
	disabled = false,
	required = false,
	placeholder,
	startIcon,
	endIcon,
	optional,
	fullWidth,
	size = 'medium',
	readOnly = false,
	onChange,
	autoFocus = false
}: FieldProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const { control, getValues } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={getValues(name)}
			render={({ field, fieldState }) => (
				<TextField
					id={`${name}-field`}
					label={label}
					type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
					placeholder={placeholder}
					required={required}
					disabled={disabled}
					error={Boolean(fieldState.error)}
					helperText={
						fieldState.error && fieldState.error.message
							? fieldState.error.message
							: optional
							? 'Optional'
							: ''
					}
					size={size}
					fullWidth={fullWidth}
					variant={disabled ? 'filled' : 'outlined'}
					InputProps={{
						autoFocus,
						sx: {
							'& input[type=number]': {
								MozAppearance: 'textfield'
							},
							'& input[type=number]::-webkit-outer-spin-button': {
								WebkitAppearance: 'none',
								margin: 0
							},
							'& input[type=number]::-webkit-inner-spin-button': {
								WebkitAppearance: 'none',
								margin: 0
							}
						},
						readOnly,
						startAdornment: startIcon ? (
							<InputAdornment position='start'>
								{typeof startIcon === 'string' ? <Icon icon={startIcon} color='action' /> : startIcon}
							</InputAdornment>
						) : null,
						endAdornment:
							type === 'password' ? (
								<InputAdornment position='end'>
									<IconButton
										icon={showPassword ? 'view' : 'viewOff'}
										title={`tooltips.${showPassword ? 'hidePassword' : 'showPassword'}`}
										onClick={() => setShowPassword(prevState => !prevState)}
									/>
								</InputAdornment>
							) : endIcon ? (
								<InputAdornment position='end'>
									<Icon icon={endIcon} color='action' />
								</InputAdornment>
							) : null
					}}
					{...field}
					onChange={e => {
						field.onChange(e);
						onChange?.(e.target.value);
					}}
				/>
			)}
		/>
	);
};

export const StandaloneField = ({
	name,
	label,
	type = 'text',
	disabled = false,
	required = false,
	placeholder,
	startIcon,
	endIcon,
	optional,
	fullWidth,
	size = 'medium',
	readOnly = false,
	onChange,
	autoFocus = false,
	value
}: StandaloneFieldProps) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<TextField
			id={`${name}-field`}
			label={label}
			type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
			placeholder={placeholder}
			required={required}
			disabled={disabled}
			size={size}
			helperText={optional ? 'Optional' : ''}
			fullWidth={fullWidth}
			variant={disabled ? 'filled' : 'outlined'}
			InputProps={{
				autoFocus,
				sx: {
					'& input[type=number]': {
						MozAppearance: 'textfield'
					},
					'& input[type=number]::-webkit-outer-spin-button': {
						WebkitAppearance: 'none',
						margin: 0
					},
					'& input[type=number]::-webkit-inner-spin-button': {
						WebkitAppearance: 'none',
						margin: 0
					}
				},
				readOnly,
				startAdornment: startIcon ? (
					<InputAdornment position='start'>
						{typeof startIcon === 'string' ? <Icon icon={startIcon} color='action' /> : startIcon}
					</InputAdornment>
				) : null,
				endAdornment:
					type === 'password' ? (
						<InputAdornment position='end'>
							<IconButton
								icon={showPassword ? 'view' : 'viewOff'}
								title={`tooltips.${showPassword ? 'hidePassword' : 'showPassword'}`}
								onClick={() => setShowPassword(prevState => !prevState)}
							/>
						</InputAdornment>
					) : endIcon ? (
						<InputAdornment position='end'>
							<Icon icon={endIcon} color='action' />
						</InputAdornment>
					) : null
			}}
			value={value}
			onChange={e => onChange(e.target.value)}
		/>
	);
};
