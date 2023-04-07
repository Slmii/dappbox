import { GridColDef } from '@mui/x-data-grid';
import { utils, WorkSheet } from 'xlsx';

export type Row = any[];
export type RowCol = { rows: Row[]; columns: GridColDef[] };

export const getRowsCols = (ws: WorkSheet): RowCol => {
	const colsLength = utils.decode_range(ws['!ref'] || 'A1').e.c + 1;

	return {
		rows: utils.sheet_to_json<Row>(ws, { header: 1, raw: false, blankrows: false }).map((r, id) => ({ ...r, id })),
		columns: Array.from(
			{
				length: colsLength
			},
			(_, i) => {
				let width = 120;

				if (ws['!cols']) {
					const cols = Object.values(ws['!cols']).slice(0, colsLength);

					for (const col of cols) {
						if (col.wch) {
							const cellWidth = col.wch * 8;

							if (cellWidth > width) {
								width = cellWidth;
							}
						}
					}
				}

				return {
					field: String(i),
					headerName: utils.encode_col(i),
					editable: true,
					minWidth: width
				};
			}
		)
	};
};
