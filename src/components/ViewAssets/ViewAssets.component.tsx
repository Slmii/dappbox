import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { PreviewBackdrop } from 'components/Actions/Preview';
import { useFavorites, usePreview } from 'lib/hooks';
import { tableStateAtom } from 'lib/recoil';
import { Asset, Doc } from 'lib/types';
import { getAssetId } from 'lib/url';
import { getTableAssets } from 'lib/utils/asset.utils';
import { Box } from 'ui-components/Box';
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
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [searchParams] = useSearchParams();
	const [{ order, orderBy, selectedAssets }, setTableState] = useRecoilState(tableStateAtom);
	const [docs, setDocs] = useState<Doc[]>([]);

	const { preview, isSuccess: previewIsSuccess, reset: previewReset } = usePreview();
	const { handleOnFavoritesToggle } = useFavorites();

	/**
	 * 1. Render assets that are a child of the current assetId in the URL
	 * 2. Sort assets asc/desc
	 */
	const tableAssets = useMemo(() => {
		// If in the middle of a search then return all assets
		if (searchParams.has('q')) {
			return assets;
		}

		const assetId = getAssetId(pathname);
		// If the current assetId in the URL is a file then redirect to homr
		if (!!assets.find(asset => asset.id === Number(assetId) && asset.type === 'file')) {
			navigate('/');
			return [];
		}

		return getTableAssets({
			assets,
			order,
			orderBy,
			assetId
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [order, orderBy, pathname, assets]);

	// Reset `selectedAssets` in table state when redirecting
	// to another folder
	useEffect(() => {
		setTableState(prevState => ({
			...prevState,
			selectedAssets: []
		}));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const downloadPreviewChunks = async (asset: Asset) => {
		if (asset.type === 'folder') {
			return;
		}

		const docs = await preview([asset]);
		setDocs(docs);
	};

	return (
		<>
			<Box
				sx={{
					// border: theme =>
					// 	isDragActive ? `1px solid ${theme.palette.primary.dark}` : '1px solid transparent',
					// borderRadius: theme => theme.shape.borderRadius,
					// backgroundColor: theme => (isDragActive ? `${theme.palette.primary.main}20` : undefined),
					position: 'relative',
					height: '100%'
				}}
			>
				{/* <div {...getRootProps({ className: 'dropzone' })}>
					<input {...getInputProps()} /> */}
				<AssetsTable
					rows={tableAssets}
					columns={columns}
					order={order}
					orderBy={orderBy}
					selectedAssets={selectedAssets}
					setOrder={order => setTableState(prevState => ({ ...prevState, order }))}
					setOrderBy={orderBy => setTableState(prevState => ({ ...prevState, orderBy }))}
					setSelectedRows={selectedAssets => setTableState(prevState => ({ ...prevState, selectedAssets }))}
					onFavoriteToggle={handleOnFavoritesToggle}
					onPreview={downloadPreviewChunks}
				/>
				{/* </div> */}
			</Box>
			{previewIsSuccess ? (
				<PreviewBackdrop
					open={previewIsSuccess}
					onClick={() => {
						previewReset();
						setDocs([]);
					}}
					docs={docs}
				/>
			) : null}
		</>
	);
};
