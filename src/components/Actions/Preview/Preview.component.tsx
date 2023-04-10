import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { usePreview } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Doc } from 'lib/types';
import { Button } from 'ui-components/Button';
import { PreviewBackdrop } from './PreviewBackdrop.component';

export const Preview = () => {
	const [docs, setDocs] = useState<Doc[]>([]);
	const { selectedAssets } = useRecoilValue(tableStateAtom);

	const { preview, isSuccess, isLoading, reset } = usePreview();

	const downloadPreviewChunks = async () => {
		const docs = await preview(selectedAssets.filter(asset => asset.type === 'file'));
		setDocs(docs);
	};

	return (
		<>
			{selectedAssets.length && selectedAssets.every(asset => asset.type === 'file') ? (
				<Button
					label='Preview'
					onClick={downloadPreviewChunks}
					startIcon='view'
					variant='outlined'
					color='inherit'
					tooltip='Previewing large files may take a while'
					loading={isLoading}
				/>
			) : null}
			{isSuccess && !!docs.length ? (
				<PreviewBackdrop
					open={isSuccess && !!docs.length}
					onClick={() => {
						reset();
						setDocs([]);
					}}
					docs={docs}
				/>
			) : null}
		</>
	);
};
