import { useMutation } from '@tanstack/react-query';
import JSZip from 'jszip';
import { useState } from 'react';

import { api } from 'api';
import { saveAs } from 'lib/functions';
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

		if (assets.length > 1) {
			const zip = new JSZip();

			for (const asset of assets) {
				const assetsToDownload: Uint8Array[] = [];

				for (const chunk of asset.chunks) {
					const res = await mutateAsync({ chunkId: chunk.id, canisterPrincipal: chunk.canister });
					assetsToDownload.push(res);
				}

				// Create a new Blob object from the file data
				const blob = new Blob(assetsToDownload, { type: 'application/octet-stream' });

				zip.file(asset.name, blob, { base64: true });
			}

			zip.generateAsync({ type: 'blob' }).then(function (content) {
				saveAs(content, 'download.zip');
			});
		} else {
			const asset = assets[0];
			const assetsToDownload: Uint8Array[] = [];

			for (const chunk of asset.chunks) {
				const res = await mutateAsync({ chunkId: chunk.id, canisterPrincipal: chunk.canister });
				assetsToDownload.push(res);
			}

			// Create a new Blob object from the file data
			const blob = new Blob(assetsToDownload, { type: 'application/octet-stream' });

			saveAs(blob, asset.name);
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
