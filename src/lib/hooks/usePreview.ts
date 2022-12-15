import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { api } from 'api';
import { Asset } from 'lib/types/Asset.types';
import { Doc } from 'lib/types/Doc.types';

export const usePreview = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const { mutateAsync } = useMutation({
		mutationFn: api.Chunk.getChunksByChunkId
	});

	const preview = async (assets: Asset[]) => {
		const docs: Doc[] = [];

		setIsLoading(true);
		setIsSuccess(false);

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

			docs.push({ url, asset });
		}

		setIsLoading(false);
		setIsSuccess(true);

		return docs;
	};

	return {
		preview,
		isLoading,
		isSuccess,
		reset: () => {
			setIsLoading(false);
			setIsSuccess(false);
		}
	};
};
