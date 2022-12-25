import { Asset } from 'lib/types/Asset.types';

export const VideoPreview = ({ url, asset }: { url: string; asset: Asset }) => {
	return (
		<video controls>
			<source src={url} type={asset.mimeType} />
		</video>
	);
};
