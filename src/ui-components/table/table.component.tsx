import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { Asset } from 'lib/generated/dappbox_types';
import { Icon } from 'ui-components/icon';
import { IconButton } from 'ui-components/icon-button';
import { Link } from 'ui-components/link';
import { Column, TableCellProps, TableHeadProps, TableProps } from './table.types';

const TableCell = React.memo(({ columnId, column, row }: TableCellProps) => {
	const { pathname } = useLocation();

	const renderValue = () => {
		const value = row[columnId as keyof Column];

		if (Array.isArray(value)) {
			if (value[0]) {
				return `${value[0].toString()}`;
			}

			return '-';
		}

		if (typeof value === 'bigint') {
			const d = new Date(Number(value));
			return new Intl.DateTimeFormat('nl-NL').format(d);
		}

		if (typeof value === 'boolean') {
			if (column.icon && column.iconAlt) {
				return (
					<IconButton
						icon={value ? column.icon : column.iconAlt}
						onClick={e => e.stopPropagation()}
						label={value ? 'Remove from favorites' : 'Add to favorites'}
					/>
				);
			}
		}

		if (row.assetType === 'folder') {
			return (
				<Link
					href={`${pathname.split('/').filter(Boolean).join('/')}/${encodeURIComponent(
						row.assetId.toString()
					)}`}
					onClick={e => e.stopPropagation()}
				>
					{value}
				</Link>
			);
		} else if (row.assetType === 'file') {
			return (
				<Box
					sx={{
						cursor: 'pointer'
					}}
					// TODO: open full dialog with preview
					onClick={e => e.stopPropagation()}
				>
					{value}
				</Box>
			);
		}

		return value;
	};

	return (
		<MuiTableCell key={`${columnId}${row.assetId}`} align={column.alignment}>
			<Box
				sx={{
					display: '-webkit-box',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					WebkitLineClamp: 1,
					WebkitBoxOrient: 'vertical'
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center'
					}}
				>
					{columnId === 'name' ? (
						<Icon icon={row.assetType === 'folder' ? 'folder' : 'download'} color='info' spacingRight />
					) : null}
					{renderValue()}
				</Box>
			</Box>
		</MuiTableCell>
	);
});

const TableHead = ({
	onSelectAllClick,
	order,
	orderBy,
	numSelected,
	rowCount,
	onRequestSort,
	columns
}: TableHeadProps) => {
	const createSortHandler = (property: keyof Column) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<MuiTableHead>
			<TableRow>
				<MuiTableCell padding='checkbox'>
					<Checkbox
						color='primary'
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all files'
						}}
						size='small'
					/>
				</MuiTableCell>
				{Object.entries(columns).map(([columnId, column]) => (
					<MuiTableCell
						key={columnId}
						align={column.alignment}
						sortDirection={orderBy === columnId ? order : false}
						width={columnId === 'name' ? `${100 - Object.keys(columns).length * 10 - 10}%` : undefined}
					>
						{column.sortable ? (
							<TableSortLabel
								active={orderBy === columnId}
								direction={orderBy === columnId ? order : 'asc'}
								onClick={createSortHandler(columnId as keyof Column)}
							>
								{column.label}
								{orderBy === columnId ? (
									<Box component='span' sx={visuallyHidden}>
										{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
									</Box>
								) : null}
							</TableSortLabel>
						) : (
							<>{column.label}</>
						)}
					</MuiTableCell>
				))}
				<MuiTableCell align='right'>Actions</MuiTableCell>
			</TableRow>
		</MuiTableHead>
	);
};

export const Table = ({
	rows,
	selectedRows,
	setSelectedRows,
	columns,
	order,
	orderBy,
	setOrder,
	setOrderBy
}: TableProps) => {
	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Asset) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelecteds = rows.map(n => n.assetId);
			setSelectedRows(newSelecteds);
			return;
		}

		setSelectedRows([]);
	};

	const handleClick = (_event: React.MouseEvent<unknown>, assetId: number) => {
		const selectedIndex = selectedRows.indexOf(assetId);
		let newSelected: number[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selectedRows, assetId);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selectedRows.slice(1));
		} else if (selectedIndex === selectedRows.length - 1) {
			newSelected = newSelected.concat(selectedRows.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selectedRows.slice(0, selectedIndex),
				selectedRows.slice(selectedIndex + 1)
			);
		}

		setSelectedRows(newSelected);
	};

	const isSelected = (assetId: number) => selectedRows.indexOf(assetId) !== -1;

	return (
		<>
			{rows.length ? (
				<TableContainer
					sx={{
						position: 'absolute',
						height: theme => `calc(100% - ${theme.spacing(1)})`
					}}
				>
					<MuiTable stickyHeader aria-labelledby='tableTitle' size='small' sx={{ minWidth: 1000 }}>
						<TableHead
							numSelected={selectedRows.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
							columns={columns}
						/>
						<TableBody>
							{rows.map((row, index) => {
								const isItemSelected = isSelected(row.assetId);
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										onClick={event => handleClick(event, row.assetId)}
										role='checkbox'
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.name}
										selected={isItemSelected}
									>
										<MuiTableCell padding='checkbox'>
											<Checkbox
												color='primary'
												checked={isItemSelected}
												inputProps={{
													'aria-labelledby': labelId
												}}
												size='small'
											/>
										</MuiTableCell>
										{Object.entries(columns).map(([columnId, column]) => (
											<TableCell
												key={`${columnId}${row.assetId}`}
												row={row}
												columnId={columnId as keyof Column}
												column={column}
											/>
										))}
										<MuiTableCell align='right'>
											{/* <IconButton icon='share' label='Share' onClick={e => e.stopPropagation()} /> */}
											<IconButton icon='more' label='More' onClick={e => e.stopPropagation()} />
										</MuiTableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</MuiTable>
				</TableContainer>
			) : (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center'
					}}
				>
					Nothing to see yet, start uploading!
				</Box>
			)}
		</>
	);
};
