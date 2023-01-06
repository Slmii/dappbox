import * as z from 'zod';

export const renameFolderSchema = z.object({
	folderName: z
		.string()
		.min(2, { message: 'Asset names must have a minimum length of 2 characters' })
		.regex(
			/^[a-zA-Z0-9-_.\s]+$/,
			'Asset names can only contain alphanumeric characters, hyphens, underscores or spaces'
		)
		.nonempty({ message: 'Asset names must have a minimum length of 2 characters' })
});
