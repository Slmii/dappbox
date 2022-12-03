import { useMutation } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';

import { api } from 'api';
import { tableStateAtom } from 'lib/recoil';
import { Button } from 'ui-components/Button';

export const Download = () => {
	const [{ selectedRows }] = useRecoilState(tableStateAtom);
	const { mutateAsync, isLoading } = useMutation({
		mutationFn: api.Asset.getChunksByChunkId
	});

	const handleOnDownload = async () => {
		for (const asset of selectedRows) {
			const assetsToDownload: Uint8Array[] = [];

			for (const chunk of asset.chunks) {
				const res = await mutateAsync(chunk.id);
				assetsToDownload.push(res);
			}

			const blob = new Blob(assetsToDownload);

			const url = window.URL.createObjectURL(blob);
			const tempLink = document.createElement('a');
			tempLink.href = url;
			tempLink.setAttribute('download', `${asset.name}.${asset.extension}`);
			tempLink.click();
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
