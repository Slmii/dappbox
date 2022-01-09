import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { getTableAssets } from 'lib/functions';
import { assetsAtom, tableAssetsAtom, tableStateAtom } from 'lib/recoil';
import { getAssetId } from 'lib/url';
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
		alignment: 'right',
		label: '',
		sortable: false,
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
	const { pathname } = useLocation();
	const [{ order, orderBy, selectedRows }, setTableState] = useRecoilState(tableStateAtom);
	const { assets } = useRecoilValue(assetsAtom);
	const [tableAssets, setTableAssets] = useRecoilState(tableAssetsAtom);

	/**
	 * 1. Render assets that are a child of the current assetId in the URL param
	 * 2. Sort assets asc/desc
	 */
	useEffect(() => {
		if (assets.length) {
			setTableAssets(
				getTableAssets({
					assets,
					order,
					orderBy,
					assetId: getAssetId(pathname)
				})
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [order, orderBy, pathname, assets]);

	// Reset `selectedRows` in table state when redirecting
	// to another folder
	useEffect(() => {
		setTableState(prevState => ({
			...prevState,
			selectedRows: []
		}));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	return (
		<Box
			sx={{
				position: 'relative',
				height: '100%'
			}}
		>
			<Table
				rows={tableAssets}
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
