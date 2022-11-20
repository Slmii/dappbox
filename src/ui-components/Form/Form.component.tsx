import { zodResolver } from '@hookform/resolvers/zod';
import FormGroup from '@mui/material/FormGroup';
import { FormProvider, useForm } from 'react-hook-form';

import { FormProps } from './Form.types';

export function Form<T>({ children, action, schema, defaultValues, mode = 'onBlur', render, myRef }: FormProps<T>) {
	const methods = useForm<T>({
		resolver: zodResolver(schema),
		defaultValues,
		mode,
		shouldFocusError: true
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(action)} ref={myRef}>
				<FormGroup>{render ? render(methods) : children}</FormGroup>
			</form>
		</FormProvider>
	);
}
