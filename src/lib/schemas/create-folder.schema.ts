import * as z from 'zod';

export const createFolderSchema = z.object({
	folderName: z
		.string()
		.min(2, { message: 'Folder names must have a minimum length of 2 characters' })
		.nonempty({ message: 'Folder names must have a minimum length of 2 characters' })
});
