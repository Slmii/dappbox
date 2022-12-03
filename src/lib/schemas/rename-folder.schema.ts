import * as z from 'zod';

export const renameFolderSchema = z.object({
	folderName: z
		.string()
		.min(2, { message: 'Asset name must be at least 2 characters long' })
		.nonempty({ message: 'Asset name must be at least 2 characters long' })
});
