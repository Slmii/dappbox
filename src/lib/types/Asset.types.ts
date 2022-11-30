import { Principal } from '@dfinity/principal';

export interface Asset {
	id: number;
	userId: Principal;
	parentId?: number;
	type: AssetType;
	name: string;
	size?: number;
	mimeType?: string;
	extension?: string;
	isFavorite: boolean;
	createdAt: Date;
}

export type AssetType = 'folder' | 'file';

export interface PostAsset {
	type: AssetType;
	name: string;
	mimeType: string;
	userId: Principal;
	parentId?: number;
	blobs: number[];
	extension: string;
}
