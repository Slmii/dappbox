import { useRecoilState, useRecoilValue } from 'recoil';

import { tableAssetsAtom, tableStateAtom } from 'lib/recoil';
import { Box } from 'ui-components/box';
import { Column, Table } from 'ui-components/table';

const columns: Column = {
	name: {
		alignment: 'left',
		label: 'Name',
		sortable: true,
		type: 'string'
	},
	isFavorite: {
		alignment: 'left',
		label: 'Favorite',
		sortable: true,
		type: 'icon',
		icon: 'favorite',
		iconAlt: 'favoriteOutlined'
	},
	extension: {
		alignment: 'left',
		label: 'Extension',
		sortable: true,
		type: 'string'
	},
	size: {
		alignment: 'left',
		label: 'Size',
		sortable: true,
		type: 'bigint'
	}
};

export const ViewAssets = () => {
	const [{ order, orderBy, selectedRows }, setTableState] = useRecoilState(tableStateAtom);
	const assets = useRecoilValue(tableAssetsAtom);

	return (
		<Box
			sx={{
				position: 'relative',
				height: '100%'
			}}
		>
			<Table
				rows={assets}
				columns={columns}
				order={order}
				orderBy={orderBy}
				selectedRows={selectedRows}
				setOrder={order => setTableState(prevState => ({ ...prevState, order }))}
				setOrderBy={orderBy => setTableState(prevState => ({ ...prevState, orderBy }))}
				setSelectedRows={selectedRows => setTableState(prevState => ({ ...prevState, selectedRows }))}
			/>
		</Box>
	);
};
