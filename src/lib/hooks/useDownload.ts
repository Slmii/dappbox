import { useMutation } from '@tanstack/react-query';

import { api } from 'api';
import { Asset } from 'lib/types/Asset.types';

export const useDownload = () => {
	const { mutateAsync, isLoading, isSuccess } = useMutation({
		mutationFn: api.Chunk.getChunksByChunkId
	});

	const download = async (assets: Asset[]) => {
		for (const asset of assets) {
			const assetsToDownload: Uint8Array[] = [];

			for (const chunk of asset.chunks) {
				const res = await mutateAsync({ chunkId: chunk.id, canisterPrincipal: chunk.canister });
				assetsToDownload.push(res);
			}

			// Create a new Blob object from the file data
			const blob = new Blob(assetsToDownload, { type: 'application/octet-stream' });

			// Generate a URL for the blob
			const url = window.URL.createObjectURL(blob);

			// Create a link to the file and set the download attribute
			const downloadLink = document.createElement('a');
			downloadLink.href = url;
			downloadLink.setAttribute('download', asset.name);
			downloadLink.click();

			downloadLink.addEventListener('click', function () {
				URL.revokeObjectURL(url);
			});
		}
	};

	return { download, isLoading, isSuccess };
};
