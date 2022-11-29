import { useRecoilValue } from 'recoil';

import { tableStateAtom } from 'lib/recoil';
import { Box, Column } from 'ui-components/Box';
import { Caption } from 'ui-components/Typography';
import { AddFolder } from './AddFolder';
import { Delete } from './Delete';
import { Download } from './Download';
import { MoveAssets } from './MoveFolder';
import { Preview } from './Preview';
import { RenameFolder } from './RenameFolder';

export const ViewActions = () => {
	const { selectedRows } = useRecoilValue(tableStateAtom);

	return (
		<>
			<Column>
				<AddFolder />
				<RenameFolder />
				<Preview />
				<Download />
				<MoveAssets />
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
