import * as z from 'zod';

export const renameFolderSchema = z.object({
	folderName: z
		.string()
		.min(2, { message: 'Asset names must have a minimum length of 2 characters' })
		.nonempty({ message: 'Asset names must have a minimum length of 2 characters' })
});
