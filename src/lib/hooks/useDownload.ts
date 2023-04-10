import { useMutation } from '@tanstack/react-query';
import JSZip from 'jszip';
import { useState } from 'react';

import { api } from 'api';
import { Asset } from 'lib/types';
import { saveAs } from 'lib/utils/asset.utils';
import { useActivities } from './useActivities';
import { useUserAssets } from './useUserAssets';

export const useDownload = () => {
	const [isLoading, setIsLoading] = useState(false);

	const { addActivity, updateActivity } = useActivities();
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

		const re = new RegExp(`${asset.name}`);
		const filesWithSameName = zip.file(re)?.length ?? 0;
		let fileName = asset.name;

		// In case of same naming then append a counter at the and of the file. Ex. File (1)
		if (filesWithSameName > 0) {
			fileName = `${asset.name} (${filesWithSameName})`;
		}

		zip.file(fileName, blob, { base64: true });
	};

	const folderZip = async (assets: Asset[], zip: JSZip) => {
		for (const asset of assets) {
			if (asset.type === 'folder') {
				const re = new RegExp(`${asset.name}`);
				const foldersWithSameName = zip.folder(re)?.length ?? 0;
				let folder: JSZip | null = null;

				// In case of same naming then append a counter at the and of the folder. Ex. Folder (1)
				if (foldersWithSameName > 0) {
					folder = zip.folder(`${asset.name} (${foldersWithSameName})`);
				} else {
					folder = zip.folder(asset.name);
				}

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

		// If there is more than 1 file selected or one of the selected assets includes a 'folder' type
		// then we need to zip the selected assets
		if (assets.length > 1 || assets.some(asset => asset.type === 'folder')) {
			// Add activity for zip download
			const activityId = addActivity({
				inProgress: true,
				isFinished: false,
				name: 'Download.zip',
				type: 'download'
			});

			try {
				const zip = new JSZip();
				await folderZip(assets, zip);

				zip.generateAsync({ type: 'blob' }).then(function (content) {
					// Update zip download activity to finished
					updateActivity(activityId, {
						inProgress: false,
						isFinished: true,
						onUndo: () => saveAs(content, 'download.zip')
					});
					saveAs(content, 'download.zip');
				});
			} catch (error) {
				// Update zip download activity to error
				updateActivity(activityId, { inProgress: false, error: (error as Error).message });
				setIsLoading(false);
			}
		}
		// If its a single selected row and its not a 'folder' type then there is no need to zip
		else if (assets.length === 1) {
			const asset = assets[0];
			const assetsToDownload: Uint8Array[] = [];

			// Add activity for asset download
			const activityId = addActivity({
				inProgress: true,
				isFinished: false,
				name: asset.name,
				type: 'download'
			});

			let hasError = '';
			for (const chunk of asset.chunks) {
				try {
					const res = await mutateAsync({ chunkId: chunk.id, canisterPrincipal: chunk.canister });
					assetsToDownload.push(res);
				} catch (error) {
					hasError = (error as Error).message;
					break;
				}
			}

			if (hasError.length) {
				// Update asset download activity to error
				updateActivity(activityId, { inProgress: false, error: hasError });
				return;
			}

			// Create a new Blob object from the file data
			const blob = new Blob(assetsToDownload, { type: 'application/octet-stream' });

			// Update asset download activity to finished
			updateActivity(activityId, { inProgress: false, isFinished: true, onUndo: () => saveAs(blob, asset.name) });
			saveAs(blob, asset.name);
		}

		setIsLoading(false);
	};

	return {
		download,
		isLoading,
		setIsLoading,
		reset: () => setIsLoading(false)
	};
};
