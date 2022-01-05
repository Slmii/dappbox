import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import * as React from 'react';

interface Data {
	name: string;
	modified: string;
	shared: string[];
	size: number;
}

function createData(name: string, modified: string, shared: string[], size: number): Data {
	return {
		name,
		modified,
		shared,
		size
	};
}

const rows = [
	createData('Cupcake', '305', ['3.7'], 67),
	createData('Donut', '452', ['25.0'], 51),
	createData('Eclair', '262', ['16.0'], 24),
	createData('Frozen yoghurt', '159', ['6.0'], 24),
	createData('Gingerbread', '356', ['16.0'], 49),
	createData('Honeycomb', '408', ['3.2'], 87),
	createData('Ice cream sandwich', '237', ['9.0'], 37),
	createData('Jelly Bean', '375', ['0.0'], 94),
	createData('KitKat', '518', ['26.0'], 65),
	createData('Lollipop', '392', ['0.2'], 98),
	createData('Marshmallow', '234', ['318', '0'], 81),
	createData('Nougat', '360', ['19.0'], 9)
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'name',
		numeric: false,
		disablePadding: true,
		label: 'Name'
	},
	{
		id: 'modified',
		numeric: false,
		disablePadding: false,
		label: 'Modified'
	},
	{
		id: 'shared',
		numeric: false,
		disablePadding: false,
		label: 'Shared with'
	},
	{
		id: 'size',
		numeric: true,
		disablePadding: false,
		label: 'Size'
	}
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function TableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }: EnhancedTableProps) {
	const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<MuiTableHead>
			<TableRow>
				<TableCell padding='checkbox'>
					<Checkbox
						color='primary'
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all files'
						}}
					/>
				</TableCell>
				{headCells.map(headCell => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component='span' sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</MuiTableHead>
	);
}

export const ViewList = () => {
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
	const [selected, setSelected] = React.useState<readonly string[]>([]);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelecteds = rows.map(n => n.name);
			setSelected(newSelecteds);
			return;
		}

		setSelected([]);
	};

	const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
		console.log({ name });
		const selectedIndex = selected.indexOf(name);
		let newSelected: readonly string[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	};

	const isSelected = (name: string) => selected.indexOf(name) !== -1;

	return (
		<TableContainer
			sx={{
				position: 'absolute',
				height: theme => `calc(100% - ${theme.spacing(3)})`
			}}
		>
			<Table stickyHeader aria-labelledby='tableTitle'>
				<TableHead
					numSelected={selected.length}
					order={order}
					orderBy={orderBy}
					onSelectAllClick={handleSelectAllClick}
					onRequestSort={handleRequestSort}
					rowCount={rows.length}
				/>
				<TableBody>
					{stableSort(rows as any, getComparator(order, orderBy)).map((row, index) => {
						const isItemSelected = isSelected(row.name as string);
						const labelId = `enhanced-table-checkbox-${index}`;

						return (
							<TableRow
								hover
								onClick={event => handleClick(event, row.name as string)}
								role='checkbox'
								aria-checked={isItemSelected}
								tabIndex={-1}
								key={row.name}
								selected={isItemSelected}
							>
								<TableCell padding='checkbox'>
									<Checkbox
										color='primary'
										checked={isItemSelected}
										inputProps={{
											'aria-labelledby': labelId
										}}
									/>
								</TableCell>
								<TableCell component='th' id={labelId} scope='row' padding='none'>
									{row.name}
								</TableCell>
								<TableCell align='left'>{row.modified}</TableCell>
								<TableCell align='left'>{(row.shared as unknown as string[]).join(',')}</TableCell>
								<TableCell align='right'>{row.size}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
