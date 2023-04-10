import { Asset } from 'lib/types';

export const AudioPreview = ({ url, asset }: { url: string; asset: Asset }) => {
	return (
		<audio controls autoPlay>
			<source src={url} type={asset.mimeType} />
		</audio>
	);
};
