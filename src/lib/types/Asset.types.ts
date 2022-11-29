import { Principal } from '@dfinity/principal';

export interface Asset {
	id: number;
	userId: Principal;
	parentId?: number;
	type: 'folder' | 'file';
	name: string;
	size?: number;
	mimeType?: string;
	extension?: string;
	isFavorite: boolean;
	createdAt: Date;
}
