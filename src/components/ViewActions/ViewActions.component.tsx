import { useRecoilValue } from 'recoil';

import { tableStateAtom } from 'lib/recoil';
import { Box, Column } from 'ui-components/Box';
import { Caption } from 'ui-components/Typography';
import { AddFolder } from './AddFolder';
import { Delete } from './Delete';
import { Download } from './Download';
import { Move } from './Move';
import { Preview } from './Preview';
import { Rename } from './Rename';

export const ViewActions = () => {
	const { selectedRows } = useRecoilValue(tableStateAtom);

	return (
		<>
			<Column>
				<AddFolder />
				<Rename />
				<Preview />
				<Download />
				<Move />
				<Delete />
				<Box
					sx={{
						marginLeft: 'auto'
					}}
				>
					<Caption title={`${selectedRows.length} selected`} />
				</Box>
			</Column>
		</>
	);
};
