import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { api } from 'api';
import { Asset } from 'lib/types/Asset.types';
import { Doc } from 'lib/types/Doc.types';

export const useDownload = () => {
	const [isDownloadLoading, setIsDownloadLoading] = useState(false);
	const [isDownloadSuccess, setIsDownloadSuccess] = useState(false);
	const [isPreviewLoading, setIsPreviewLoading] = useState(false);
	const [isPreviewSuccess, setIsPreviewSuccess] = useState(false);

	const { mutateAsync } = useMutation({
		mutationFn: api.Chunk.getChunksByChunkId
	});

	const download = async (assets: Asset[]) => {
		setIsDownloadLoading(true);
		setIsDownloadSuccess(false);

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

		setIsDownloadLoading(false);
		setIsDownloadSuccess(true);
	};

	const preview = async (assets: Asset[]) => {
		const docs: Doc[] = [];

		setIsPreviewLoading(true);
		setIsPreviewSuccess(false);

		for (const asset of assets) {
			const assetsToPreview: Uint8Array[] = [];

			for (const chunk of asset.chunks) {
				const res = await mutateAsync({ chunkId: chunk.id, canisterPrincipal: chunk.canister });
				assetsToPreview.push(res);
			}

			// Create a new Blob object from the file data
			const blob = new Blob(assetsToPreview, { type: asset.mimeType });

			// Generate a URL for the blob
			const url = window.URL.createObjectURL(blob);

			docs.push({ name: asset.name, url, mimeType: asset.mimeType ?? '' });
		}

		setIsPreviewLoading(false);
		setIsPreviewSuccess(true);

		return docs;
	};

	return {
		download,
		preview,
		isDownloadLoading,
		isPreviewLoading,
		isDownloadSuccess,
		isPreviewSuccess,
		resetPreview: () => {
			setIsPreviewLoading(false);
			setIsPreviewSuccess(false);
		}
	};
};
