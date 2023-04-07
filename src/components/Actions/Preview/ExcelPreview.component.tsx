import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import {
	DataGrid,
	GridColDef,
	gridPageCountSelector,
	gridPageSelector,
	useGridApiContext,
	useGridSelector
} from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { read, WorkBook } from 'xlsx';

import { SPACING } from 'lib/constants/spacing.constants';
import { Asset } from 'lib/types';
import { getRowsCols, Row } from 'lib/utils/preview.utils';
import { Box, Column } from 'ui-components/Box';
import { Button } from 'ui-components/Button';

export const ExcelPreview = ({ url }: { url: string; asset: Asset }) => {
	const [workBook, setWorkBook] = useState<WorkBook>();
	const [activeSheet, setActiveSheet] = useState('');
	const [sheets, setSheets] = useState<string[]>([]);
	const [rows, setRows] = useState<Row[]>([]);
	const [columns, setColumns] = useState<GridColDef[]>([]);

	useEffect(() => {
		(async () => {
			const file = await (await fetch(url)).arrayBuffer();
			const wb = read(file, { type: 'binary', cellStyles: true });
			const ws = wb.Sheets[wb.SheetNames[0]];

			setWorkBook(wb);
			setSheets(wb.SheetNames);
			setActiveSheet(wb.SheetNames[0]);

			const { columns, rows } = getRowsCols(ws);

			setRows(rows);
			setColumns(columns);
		})();
	}, [url]);

	const excelSheets = useMemo(() => {
		return sheets.map(sheet => ({
			name: sheet,
			onClick: (name: string) => {
				if (!workBook) {
					return;
				}

				const ws = workBook.Sheets[name];
				const { columns, rows } = getRowsCols(ws);

				setRows(rows);
				setColumns(columns);
				setActiveSheet(name);
			},
			active: sheet === activeSheet
		}));
	}, [activeSheet, sheets, workBook]);

	return (
		<DataGrid
			columns={columns}
			rows={rows}
			disableSelectionOnClick
			rowsPerPageOptions={[]}
			components={{
				Pagination: CustomPagination
			}}
			componentsProps={{
				pagination: { sheets: excelSheets }
			}}
		/>
	);
};

const CustomPagination = ({
	sheets
}: {
	sheets: { name: string; active: boolean; onClick: (name: string) => void }[];
}) => {
	const apiRef = useGridApiContext();
	const page = useGridSelector(apiRef, gridPageSelector);
	const pageCount = useGridSelector(apiRef, gridPageCountSelector);

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				width: '100%',
				padding: SPACING
			}}
		>
			<Column>
				{sheets.map(sheet => (
					<Button
						key={sheet.name}
						label={sheet.name}
						onClick={() => sheet.onClick(sheet.name)}
						variant={sheet.active ? 'contained' : 'text'}
					/>
				))}
			</Column>
			<Pagination
				color='primary'
				shape='rounded'
				page={page + 1}
				count={pageCount}
				// @ts-expect-error
				renderItem={props => <PaginationItem {...props} disableRipple />}
				onChange={(_event: React.ChangeEvent<unknown>, value: number) => apiRef.current.setPage(value - 1)}
			/>
		</Box>
	);
};
