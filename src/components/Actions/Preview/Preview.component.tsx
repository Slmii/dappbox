import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { usePreview } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Doc } from 'lib/types/Doc.types';
import { Button } from 'ui-components/Button';
import { PreviewBackdrop } from './PreviewBackdrop.component';

export const Preview = () => {
	const [docs, setDocs] = useState<Doc[]>([]);
	const { selectedRows } = useRecoilValue(tableStateAtom);

	const { preview, isSuccess, isLoading, reset } = usePreview();

	const downloadPreviewChunks = async () => {
		const docs = await preview(selectedRows.filter(row => row.type === 'file'));
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
					loading={isLoading}
				/>
			) : null}
			{isSuccess ? (
				<PreviewBackdrop
					open={isSuccess}
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
