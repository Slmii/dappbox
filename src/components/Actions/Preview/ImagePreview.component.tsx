import { Asset } from 'lib/types/Asset.types';

export const ImagePreview = ({ url, asset }: { url: string; asset: Asset }) => {
	return (
		<img
			style={{
				height: '100%',
				width: '100%',
				objectFit: 'contain'
			}}
			src={url}
			alt={asset.name}
		/>
	);
};
