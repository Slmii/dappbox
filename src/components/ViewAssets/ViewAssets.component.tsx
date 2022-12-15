import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { PreviewBackdrop } from 'components/Actions/Preview';
import { getTableAssets } from 'lib/functions';
import { useDownload, useFavorites } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Asset } from 'lib/types/Asset.types';
import { Doc } from 'lib/types/Doc.types';
import { getAssetId } from 'lib/url';
import { Box } from 'ui-components/Box';
import { Snackbar } from 'ui-components/Snackbar';
import { AssetsTable, Column } from 'ui-components/Table';

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
	},
	updatedAt: {
		alignment: 'left',
		label: 'Modifed',
		sortable: true,
		type: 'date'
	}
};

export const ViewAssets = ({ assets }: { assets: Asset[] }) => {
	const { pathname } = useLocation();
	const { handleOnFavoritesToggle, isLoading: toggleFavoriteIsLoading, removeOrAdd } = useFavorites();
	const [{ order, orderBy, selectedRows }, setTableState] = useRecoilState(tableStateAtom);
	const [docs, setDocs] = useState<Doc[]>([]);

	const { preview, isPreviewSuccess, resetPreview } = useDownload();

	const downloadPreviewChunks = async (asset: Asset) => {
		const docs = await preview([asset]);
		setDocs(docs);
	};

	/**
	 * 1. Render assets that are a child of the current assetId in the URL
	 * 2. Sort assets asc/desc
	 */
	const tableAssets = useMemo(() => {
		return getTableAssets({
			assets,
			order,
			orderBy,
			assetId: getAssetId(pathname)
		});
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
		<>
			<Box
				sx={{
					position: 'relative',
					height: '100%'
				}}
			>
				<AssetsTable
					rows={tableAssets}
					columns={columns}
					order={order}
					orderBy={orderBy}
					selectedRows={selectedRows}
					setOrder={order => setTableState(prevState => ({ ...prevState, order }))}
					setOrderBy={orderBy => setTableState(prevState => ({ ...prevState, orderBy }))}
					setSelectedRows={selectedRows => setTableState(prevState => ({ ...prevState, selectedRows }))}
					onFavoriteToggle={assetId => handleOnFavoritesToggle(assetId)}
					onPreview={downloadPreviewChunks}
				/>
			</Box>
			<Snackbar
				open={toggleFavoriteIsLoading}
				message={`${removeOrAdd === 'add' ? 'Adding asset to' : 'Removing asset from'} favorites`}
				loader
			/>
			<PreviewBackdrop
				open={isPreviewSuccess}
				onClick={() => {
					resetPreview();
					setDocs([]);
				}}
				docs={docs}
			/>
		</>
	);
};
