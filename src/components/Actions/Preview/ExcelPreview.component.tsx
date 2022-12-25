import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { read, WorkBook } from 'xlsx';

import { constants } from 'lib/constants';
import { Asset } from 'lib/types/Asset.types';
import { getRowsCols, Row } from 'lib/utils';
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
			components={{
				Footer
			}}
			componentsProps={{
				footer: { sheets: excelSheets }
			}}
		/>
	);
};

const Footer = ({ sheets }: { sheets: { name: string; active: boolean; onClick: (name: string) => void }[] }) => {
	return (
		<Box
			sx={{
				padding: constants.SPACING
			}}
		>
			<Column>
				{sheets.map(sheet => (
					<Button
						label={sheet.name}
						onClick={() => sheet.onClick(sheet.name)}
						variant={sheet.active ? 'contained' : 'text'}
					/>
				))}
			</Column>
		</Box>
	);
};
