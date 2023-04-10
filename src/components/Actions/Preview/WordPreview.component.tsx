import { Asset } from 'lib/types';

export const WordPreview = ({ url, asset }: { url: string; asset: Asset }) => {
	return (
		<iframe
			src=''
			style={{
				width: '100%',
				height: '100%',
				border: 'none',
				borderRadius: 8
			}}
			referrerPolicy='strict-origin'
			title={asset.name}
		/>
	);
};
