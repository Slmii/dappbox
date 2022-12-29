import { useMutation } from '@tanstack/react-query';
import JSZip from 'jszip';
import { useState } from 'react';

import { api } from 'api';
import { Asset } from 'lib/types';
import { saveAs } from 'lib/utils';
import { useUserAssets } from './useUserAssets';

export const useDownload = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const { getChildAssets } = useUserAssets();
	const { mutateAsync } = useMutation({
		mutationFn: api.Chunks.getChunksByChunkId
	});

	const assetZip = async (asset: Asset, zip: JSZip) => {
		const assetsToDownload: Uint8Array[] = [];

		for (const chunk of asset.chunks) {
			const res = await mutateAsync({ chunkId: chunk.id, canisterPrincipal: chunk.canister });
			assetsToDownload.push(res);
		}

		// Create a new Blob object from the file data
		const blob = new Blob(assetsToDownload, { type: 'application/octet-stream' });
		zip.file(asset.name, blob, { base64: true });
	};

	const folderZip = async (assets: Asset[], zip: JSZip) => {
		for (const asset of assets) {
			if (asset.type === 'folder') {
				const folder = zip.folder(asset.name);

				if (folder) {
					const childAssets = getChildAssets(asset.id);
					await folderZip(childAssets, folder);
				}
			} else {
				await assetZip(asset, zip);
			}
		}
	};

	const download = async (assets: Asset[]) => {
		setIsLoading(true);
		setIsSuccess(false);

		// If there is more than 1 file selected or one of the selected assets includes a 'folde' type
		// then we need to zip the selected assets
		if (assets.length > 1 || assets.some(asset => asset.type === 'folder')) {
			const zip = new JSZip();
			await folderZip(assets, zip);

			zip.generateAsync({ type: 'blob' }).then(function (content) {
				saveAs(content, 'download.zip');
			});
		}
		// If its a single selected row and its not a 'folder' type then there is no need to zip
		else {
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
