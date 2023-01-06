import * as z from 'zod';

export const createFolderSchema = z.object({
	folderName: z
		.string()
		.min(2, { message: 'Folder names must have a minimum length of 2 characters' })
		.regex(
			/^[a-zA-Z0-9-_.\s]+$/,
			'Folder names can only contain alphanumeric characters, hyphens, underscores or spaces'
		)
		.nonempty({ message: 'Folder names must have a minimum length of 2 characters' })
});
