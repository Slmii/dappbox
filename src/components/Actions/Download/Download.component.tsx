import { useRecoilValue } from 'recoil';

import { useDownload } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Button } from 'ui-components/Button';

export const Download = () => {
	const { selectedAssets } = useRecoilValue(tableStateAtom);
	const { download } = useDownload();

	return (
		<>
			{selectedAssets.length ? (
				<Button
					label='Download'
					startIcon='download'
					variant='outlined'
					color='inherit'
					tooltip='Downloading large files may take a while'
					onClick={async () => {
						await download(selectedAssets);
					}}
				/>
			) : null}
		</>
	);
};
