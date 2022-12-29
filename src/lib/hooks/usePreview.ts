import { useMutation } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { previewAtom } from 'lib/recoil';
import { Asset, Doc } from 'lib/types';

export const usePreview = () => {
	const [{ isLoading, isSuccess }, setPreviewState] = useRecoilState(previewAtom);

	const { mutateAsync } = useMutation({
		mutationFn: api.Chunks.getChunksByChunkId
	});

	const preview = async (assets: Asset[]) => {
		const docs: Doc[] = [];

		setPreviewState({
			isLoading: true,
			isSuccess: false
		});

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

		setPreviewState({
			isLoading: false,
			isSuccess: true
		});

		return docs;
	};

	return {
		preview,
		isLoading,
		isSuccess,
		reset: () =>
			setPreviewState({
				isLoading: false,
				isSuccess: false
			})
	};
};
