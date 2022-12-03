import { useMutation } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { tableStateAtom } from 'lib/recoil';
import { Button } from 'ui-components/Button';

export const Download = () => {
	const [{ selectedRows }] = useRecoilState(tableStateAtom);
	const { mutateAsync, isLoading } = useMutation({
		mutationFn: api.Chunk.getChunksByChunkId
	});

	const handleOnDownload = async () => {
		for (const asset of selectedRows) {
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
			downloadLink.setAttribute('download', `${asset.name}.${asset.extension}`);
			downloadLink.click();

			downloadLink.addEventListener('click', function () {
				URL.revokeObjectURL(url);
			});
		}
	};

	return (
		<>
			{selectedRows.length ? (
				<Button
					label='Download'
					startIcon='download'
					variant='outlined'
					color='inherit'
					onClick={handleOnDownload}
					loading={isLoading}
				/>
			) : null}
		</>
	);
};
