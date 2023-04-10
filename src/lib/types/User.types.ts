import { Principal } from '@dfinity/principal';

export interface User {
	id: Principal;
	username?: string;
	createdAt: Date;
	canisters: Principal[];
	aliasUserIds: Principal[];
}
