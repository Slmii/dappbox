import { useRecoilValue } from 'recoil';

import { useDownload } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Button } from 'ui-components/Button';

export const Download = () => {
	const { selectedRows } = useRecoilValue(tableStateAtom);
	const { download, isLoading } = useDownload();

	const hasFolderSelected = selectedRows.some(row => row.type === 'folder');

	return (
		<>
			{selectedRows.length ? (
				<Button
					label='Download'
					startIcon='download'
					variant='outlined'
					color='inherit'
					onClick={async () => download(selectedRows.filter(row => row.type === 'file'))}
					loading={isLoading}
					disabled={hasFolderSelected}
					tooltip={hasFolderSelected ? 'No support for folder downloads yet' : undefined}
				/>
			) : null}
		</>
	);
};
