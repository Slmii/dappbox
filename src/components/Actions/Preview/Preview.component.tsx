import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { useDownload } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Doc } from 'lib/types/Doc.types';
import { Button } from 'ui-components/Button';
import { PreviewBackdrop } from './PreviewBackdrop.component';

export const Preview = () => {
	const [docs, setDocs] = useState<Doc[]>([]);
	const { selectedRows } = useRecoilValue(tableStateAtom);

	const { preview, isPreviewSuccess, isPreviewLoading, resetPreview } = useDownload();

	const downloadPreviewChunks = async () => {
		const docs = await preview(selectedRows);
		setDocs(docs);
	};

	return (
		<>
			{selectedRows.length && selectedRows.every(asset => asset.type === 'file') ? (
				<Button
					label='Preview'
					onClick={downloadPreviewChunks}
					startIcon='view'
					variant='outlined'
					color='inherit'
					loading={isPreviewLoading}
				/>
			) : null}
			<PreviewBackdrop
				open={isPreviewSuccess}
				onClick={() => {
					resetPreview();
					setDocs([]);
				}}
				docs={docs}
			/>
		</>
	);
};
