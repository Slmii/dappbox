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
import { useLocation, useNavigate } from 'react-router-dom';

import { SPACING } from 'lib/constants/spacing.constants';
import { Asset } from 'lib/types/Asset.types';
import { formatBytes } from 'lib/utils/conversion.utils';
import { Icon } from 'ui-components/Icon';
import { IconButton } from 'ui-components/IconButton';
import { CircularProgress } from 'ui-components/Progress';
import { Column, TableCellProps, TableHeadProps, TableProps } from './Table.types';

const TableCell = React.memo(({ columnId, column, row, onFavoriteToggle, onNavigate }: TableCellProps) => {
	const renderValue = () => {
		const value = row[columnId as keyof Column];

		if (typeof value !== 'boolean' && !value) {
			return '-';
		}

		if (value instanceof Date) {
			return new Intl.DateTimeFormat('nl-NL', {
				day: '2-digit',
				month: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hourCycle: 'h23'
			}).format(value);
		}

		if (typeof value === 'boolean') {
			if (column.icon && column.iconAlt) {
				return (
					<IconButton
						icon={value ? column.icon : column.iconAlt}
						onClick={e => {
							e.stopPropagation();
							onFavoriteToggle(row.id);
						}}
						disabled={row.placeholder}
						label={value ? 'Remove from favorites' : 'Add to favorites'}
					/>
				);
			}
		}

		if (row.type === 'folder') {
			return (
				<Box sx={{ cursor: 'pointer' }} onClick={() => onNavigate(row)}>
					{value.toString()}
				</Box>
			);
		} else {
			if (columnId === 'size') {
				return formatBytes(value as number);
			}

			return (
				<Box
					sx={{
						cursor: 'pointer',
						display: '-webkit-box',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						WebkitLineClamp: 1,
						WebkitBoxOrient: 'vertical'
					}}
					onClick={e => {
						e.stopPropagation();
						onNavigate(row);
					}}
				>
					{value.toString()}
				</Box>
			);
		}
	};

	return (
		<MuiTableCell key={`${columnId}${row.id}`} align={column.alignment}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					color: row.placeholder ? 'text.disabled' : 'text.primary'
				}}
			>
				{columnId === 'name' ? (
					<>
						{row.placeholder ? (
							<CircularProgress sx={{ mr: SPACING }} />
						) : (
							<Icon
								icon={row.type === 'folder' ? 'folder' : 'download'}
								color={row.placeholder ? 'disabled' : 'info'}
								spacingRight
							/>
						)}
					</>
				) : null}
				{renderValue()}
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
						width={
							columnId === 'name'
								? `${100 - Object.keys(columns).length * 10 - 10}%`
								: column.type === 'icon'
								? '20px'
								: undefined
						}
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
				{/* <MuiTableCell align='right'>Actions</MuiTableCell> */}
			</TableRow>
		</MuiTableHead>
	);
};

export const AssetsTable = ({
	rows,
	selectedAssets,
	setSelectedRows,
	columns,
	order,
	orderBy,
	setOrder,
	setOrderBy,
	onFavoriteToggle,
	onPreview
}: TableProps) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Asset) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			setSelectedRows(rows.filter(row => !row.placeholder));
			return;
		}

		setSelectedRows([]);
	};

	const handleOnRowClick = (_event: React.MouseEvent<unknown>, asset: Asset) => {
		const selectedIndex = selectedAssets.findIndex(({ id }) => id === asset.id);

		setSelectedRows([]);
		if (selectedIndex === -1) {
			setSelectedRows([asset]);
		}
	};

	const handleCheckboxClick = (asset: Asset) => {
		const selectedIndex = selectedAssets.findIndex(({ id }) => id === asset.id);
		let newSelected: Asset[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selectedAssets, asset);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selectedAssets.slice(1));
		} else if (selectedIndex === selectedAssets.length - 1) {
			newSelected = newSelected.concat(selectedAssets.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selectedAssets.slice(0, selectedIndex),
				selectedAssets.slice(selectedIndex + 1)
			);
		}

		setSelectedRows(newSelected);
	};

	const handleOnDoubleClick = async (asset: Asset) => {
		if (asset.type === 'folder') {
			navigate(`${pathname.split('/').filter(Boolean).join('/')}/${encodeURIComponent(asset.id.toString())}`);
		} else {
			await onPreview(asset);
		}
	};

	const isSelected = (assetId: number) => selectedAssets.findIndex(asset => asset.id === assetId) !== -1;

	return (
		<TableContainer
			sx={{
				position: 'absolute',
				height: theme => `calc(100% - ${theme.spacing(1)})`
			}}
		>
			<MuiTable stickyHeader aria-labelledby='tableTitle' size='small' sx={{ minWidth: 1000 }}>
				<TableHead
					numSelected={selectedAssets.length}
					order={order}
					orderBy={orderBy}
					onSelectAllClick={handleSelectAllClick}
					onRequestSort={handleRequestSort}
					rowCount={rows.length}
					columns={columns}
				/>
				<TableBody>
					{rows.map(asset => {
						const isItemSelected = isSelected(asset.id);
						const labelId = `enhanced-table-checkbox-${asset.id}`;

						return (
							<TableRow
								hover
								onClick={event =>
									!isItemSelected && !asset.placeholder && handleOnRowClick(event, asset)
								}
								onDoubleClick={() => !asset.placeholder && handleOnDoubleClick(asset)}
								role='checkbox'
								aria-checked={isItemSelected}
								tabIndex={-1}
								key={asset.id}
								selected={isItemSelected}
							>
								<MuiTableCell padding='checkbox'>
									<Checkbox
										color='primary'
										disabled={asset.placeholder}
										checked={isItemSelected}
										inputProps={{
											'aria-labelledby': labelId
										}}
										size='small'
										onClick={e => {
											e.stopPropagation();
											handleCheckboxClick(asset);
										}}
									/>
								</MuiTableCell>
								{Object.entries(columns).map(([columnId, column]) => (
									<TableCell
										key={`${columnId}${asset.id}`}
										row={asset}
										columnId={columnId as keyof Column}
										column={column}
										onFavoriteToggle={onFavoriteToggle}
										onNavigate={handleOnDoubleClick}
									/>
								))}
								{/* <MuiTableCell align='right'>
									<IconButton icon='share' label='Share' onClick={e => e.stopPropagation()} />
									<IconButton icon='more' label='More' onClick={e => e.stopPropagation()} />
								</MuiTableCell> */}
							</TableRow>
						);
					})}
				</TableBody>
			</MuiTable>
		</TableContainer>
	);
};
