import { Principal } from '@dfinity/principal';

export interface User {
	userId: Principal;
	username?: string;
	createdAt: Date;
}
