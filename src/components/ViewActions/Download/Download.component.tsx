import { useRecoilState } from 'recoil';

import { tableStateAtom } from 'lib/recoil';
import { Button } from 'ui-components/Button';

export const Download = () => {
	const [{ selectedRows }] = useRecoilState(tableStateAtom);

	return (
		<>
			{selectedRows.length ? (
				<Button label='Download' startIcon='download' variant='outlined' color='inherit' />
			) : null}
		</>
	);
};
