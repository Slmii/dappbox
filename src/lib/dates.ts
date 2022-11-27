import fromUnixTime from 'date-fns/fromUnixTime';

export const dateFromBigInt = (date: bigint) => {
	const unix = date / BigInt(1e9);
	return fromUnixTime(Number(unix));
};
