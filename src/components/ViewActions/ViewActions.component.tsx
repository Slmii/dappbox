import { useRecoilValue } from 'recoil';

import { constants } from 'lib/constants';
import { tableStateAtom } from 'lib/recoil';
import { Box } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { Caption } from 'ui-components/Typography';
import { MoveAssets } from './MoveFolder';
import { RenameFolder } from './RenameFolder';

export const ViewActions = () => {
	const { selectedRows } = useRecoilValue(tableStateAtom);

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					'& > *:not(:last-child)': {
						marginRight: constants.SPACING
					}
				}}
			>
				{/* // TODO: move to own component */}
				<Button
					label='Add folder'
					startIcon='addFolderOutlined'
					variant='contained'
					color='inherit'
					sx={{
						color: 'black'
					}}
				/>
				{selectedRows.length ? (
					<>
						<RenameFolder />
						{selectedRows.some(row => row.assetType === 'file') ? (
							<>
								{/* // TODO: move to own component */}
								<Button label='Preview' startIcon='view' variant='outlined' color='inherit' />
							</>
						) : null}
						{/* // TODO: move to own component */}
						<Button label='Download' startIcon='download' variant='outlined' color='inherit' />
						<MoveAssets />
						{/* // TODO: move to own component */}
						<Button label='Delete' startIcon='delete' color='error' />
					</>
				) : null}
				<Box
					sx={{
						marginLeft: 'auto'
					}}
				>
					<Caption title={`${selectedRows.length} selected`} />
				</Box>
			</Box>
		</>
	);
};
