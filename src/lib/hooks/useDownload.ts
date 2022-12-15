import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { api } from 'api';
import { Asset } from 'lib/types/Asset.types';

export const useDownload = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const { mutateAsync } = useMutation({
		mutationFn: api.Chunk.getChunksByChunkId
	});

	const download = async (assets: Asset[]) => {
		setIsLoading(true);
		setIsSuccess(false);

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

		setIsLoading(false);
		setIsSuccess(true);
	};

	return {
		download,
		isLoading,
		isSuccess,
		reset: () => {
			setIsLoading(false);
			setIsSuccess(false);
		}
	};
};
