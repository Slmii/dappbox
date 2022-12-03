import { Principal } from '@dfinity/principal';

import { Chunk } from 'declarations/assets/assets.did';

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
	chunks: Chunk[];
	createdAt: Date;
	updatedAt: Date;
}

export type AssetType = 'folder' | 'file';
