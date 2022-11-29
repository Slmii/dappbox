import { useRecoilState } from 'recoil';

import { tableStateAtom } from 'lib/recoil';
import { Button } from 'ui-components/Button';

export const Preview = () => {
	const [{ selectedRows }] = useRecoilState(tableStateAtom);

	return (
		<>
			{selectedRows.some(row => row.type === 'file') ? (
				<Button label='Preview' startIcon='view' variant='outlined' color='inherit' />
			) : null}
		</>
	);
};
