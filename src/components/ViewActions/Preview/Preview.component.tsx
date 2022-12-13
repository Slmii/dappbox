import { useRecoilState } from 'recoil';

import { tableStateAtom } from 'lib/recoil';
import { Button } from 'ui-components/Button';

export const Preview = () => {
	const [{ selectedRows }] = useRecoilState(tableStateAtom);

	return (
		<>
			{selectedRows.length === 1 && selectedRows[0].type === 'file' ? (
				<Button label='Preview (Soon)' disabled startIcon='view' variant='outlined' color='inherit' />
			) : null}
		</>
	);
};
