import { Asset } from 'lib/types';

export const VideoPreview = ({ url, asset }: { url: string; asset: Asset }) => {
	return (
		<video controls autoPlay>
			<source src={url} type='video/mp4' />
			Your browser does not support the video tag.
		</video>
	);
};
