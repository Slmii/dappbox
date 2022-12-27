import { ReactNode, Ref } from 'react';
import { DeepPartial, FieldValues, Mode, SubmitHandler, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

export interface FormProps<T extends FieldValues> {
	/**
	 * Function to execute on form submit
	 */
	action: SubmitHandler<T>;
	/**
	 * Validator schema. Either a joi or yup schema.
	 */
	schema?: z.ZodObject<any>;
	/**
	 * Default values in a form
	 */
	defaultValues: DeepPartial<T>;
	/**
	 * Option to configure the validation before onSubmit event
	 */
	mode?: Mode;
	/**
	 * Render all JSX elements with this prop. Using this prop will make react hook form props
	 * available as parameters to use, example `getValues, formState`.
	 *
	 * Using this prop will also ignore direct children,
	 */
	render?: (props: UseFormReturn<T>) => JSX.Element;
	/**
	 * Optional ref. This is necessary if you want to submit the form outside the form component
	 * itself, example a Dialog component.
	 */
	myRef?: Ref<HTMLFormElement>;
	children?: ReactNode;
}
