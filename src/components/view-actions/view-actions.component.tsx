import { useRecoilValue } from 'recoil';

import { tableStateAtom } from 'lib/recoil';
import { Box } from 'ui-components/box';
import { Button } from 'ui-components/button';
import { Caption } from 'ui-components/typography';

export const ViewActions = () => {
	const { selectedRows } = useRecoilValue(tableStateAtom);

	return (
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
			<Box
				sx={{
					color: 'black'
				}}
			>
				<Button label='Add folder' startIcon='addFolderOutlined' variant='contained' color='inherit' />
			</Box>
			{selectedRows.length > 0 ? (
				<>
					{selectedRows.length === 1 ? (
						<Button label='Preview' startIcon='viewOutlined' variant='outlined' color='inherit' />
					) : null}
					<Button label='Download' startIcon='downloadOutlined' variant='outlined' color='inherit' />
					<Button label='Move' variant='outlined' startIcon='folderOutlined' color='inherit' />
					<Button label='Copy' startIcon='copyOutlined' variant='outlined' color='inherit' />
					<Button label='Delete' startIcon='deleteOutlined' color='error' />
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
	);
};
