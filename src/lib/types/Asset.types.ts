import { Principal } from '@dfinity/principal';

export interface Asset {
	assetId: number;
	userId: Principal;
	parentId?: number;
	assetType: 'folder' | 'file';
	name: string;
	size?: number;
	mimeType?: string;
	extension?: string;
	isFavorite: boolean;
	createdAt: Date;
}
