import { useRecoilValue } from 'recoil';

import { tableStateAtom } from 'lib/recoil';
import { Box } from 'ui-components/box';
import { Button } from 'ui-components/button';
import { Caption } from 'ui-components/typography';
import { MoveAssets } from './move-folder';
import { RenameFolder } from './rename-folder.component';

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
						marginRight: 1
					}
				}}
			>
				<Button
					label='Add folder'
					startIcon='addFolderOutlined'
					variant='contained'
					color='inherit'
					sx={{
						color: 'black'
					}}
				/>
				{selectedRows.length > 0 ? (
					<>
						{selectedRows.length === 1 ? (
							<>
								{selectedRows[0].assetType === 'folder' ? (
									<RenameFolder />
								) : (
									<Button label='Preview' startIcon='view' variant='outlined' color='inherit' />
								)}
							</>
						) : null}
						<Button label='Download' startIcon='download' variant='outlined' color='inherit' />
						<MoveAssets />
						<Button label='Delete' startIcon='delete' color='error' />
						<Box
							sx={{
								marginLeft: 'auto'
							}}
						>
							<Caption title={`${selectedRows.length} selected`} />
						</Box>
					</>
				) : null}
			</Box>
		</>
	);
};
