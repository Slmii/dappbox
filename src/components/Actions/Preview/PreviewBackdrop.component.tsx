import Paper from '@mui/material/Paper';
import { useMemo, useState } from 'react';

import { constants } from 'lib/constants';
import { useDownload, useKeyPress } from 'lib/hooks';
import { Asset } from 'lib/types/Asset.types';
import { Doc } from 'lib/types/Doc.types';
import { Backdrop } from 'ui-components/Backdrop';
import { Box, Column } from 'ui-components/Box';
import { IconButton } from 'ui-components/IconButton';
import { Paragraph } from 'ui-components/Typography';
import { AudioPreview } from './AudioPreview.component';
import { ExcelPreview } from './ExcelPreview.component';
import { ImagePreview } from './ImagePreview.component';
import { excelMimeTypes } from './Preview.constants';
import { VideoPreview } from './VideoPreview.component';

export const PreviewBackdrop = ({ open, docs, onClick }: { open: boolean; docs: Doc[]; onClick: () => void }) => {
	const [previewIndex, setPreviewIndex] = useState(0);
	const { download, isLoading } = useDownload();

	useKeyPress('ArrowLeft', () => handleOnPrevious());
	useKeyPress('ArrowRight', () => handleOnNext());
	useKeyPress('Escape', () => {
		setPreviewIndex(0);
		onClick();
	});

	const docToUse = useMemo(() => {
		return typeof docs[previewIndex] !== 'undefined' ? docs[previewIndex] : null;
	}, [docs, previewIndex]);

	const handleOnPrevious = () => {
		if (previewIndex === 0) {
			setPreviewIndex(docs.length - 1);
		} else {
			setPreviewIndex(prevState => prevState - 1);
		}
	};

	const handleOnNext = () => {
		if (previewIndex + 1 === docs.length) {
			setPreviewIndex(0);
		} else {
			setPreviewIndex(prevState => prevState + 1);
		}
	};

	const handleOnDownload = async (asset: Asset) => {
		await download([asset]);
	};

	if (!docToUse) {
		return null;
	}

	return (
		<Backdrop
			open={open}
			onClick={() => {
				setPreviewIndex(0);
				onClick();
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					background: 'linear-gradient(to top, transparent 0%, black 100%)',
					padding: theme => theme.spacing(constants.SPACING)
				}}
			>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Column>
						<IconButton icon='close' label='Close' color='inherit' />
						<Paragraph>{docToUse.asset.name}</Paragraph>
					</Column>
					<Column>
						<IconButton
							icon='download'
							label='Download'
							color='inherit'
							loading={isLoading}
							onClick={e => {
								e.stopPropagation();
								handleOnDownload(docToUse.asset);
							}}
						/>
						<IconButton
							icon='print'
							label='Print'
							onClick={e => {
								e.stopPropagation();
								window.print();
							}}
							color='inherit'
						/>
						<IconButton
							icon='newWindow'
							label='Open in new window'
							onClick={e => {
								e.stopPropagation();
								window.open(docToUse.url, '_blank');
							}}
							color='inherit'
						/>
					</Column>
				</Box>
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: 'calc(100% - 200px)',
					height: 'calc(100% - 150px)'
				}}
				onClick={e => e.stopPropagation()}
			>
				{docs.length > 1 ? (
					<IconButton
						icon='previous'
						label='Previous'
						onClick={handleOnPrevious}
						sx={{ marginRight: theme => theme.spacing(constants.SPACING) }}
						color='inherit'
					/>
				) : null}
				<Paper
					elevation={1}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: theme => theme.spacing(constants.SPACING),
						borderRadius: theme => theme.shape.borderRadius,
						width: '100%',
						height: '100%',
						overflowY: 'auto'
					}}
				>
					{docToUse.asset.mimeType?.includes('image') ? (
						<ImagePreview asset={docToUse.asset} url={docToUse.url} />
					) : null}
					{docToUse.asset.mimeType?.includes('audio') ? (
						<AudioPreview asset={docToUse.asset} url={docToUse.url} />
					) : null}
					{docToUse.asset.mimeType?.includes('video') ? (
						<VideoPreview asset={docToUse.asset} url={docToUse.url} />
					) : null}
					{docToUse.asset.mimeType && excelMimeTypes.includes(docToUse.asset.mimeType) ? (
						<ExcelPreview url={docToUse.url} asset={docToUse.asset} />
					) : null}
					{/* {docToUse &&
					docToUse.asset.mimeType &&
					!['image', 'audio', 'video'].includes(docToUse.asset.mimeType) ? (
						<Paper
							elevation={1}
							sx={{
								padding: theme => theme.spacing(constants.SPACING),
								borderRadius: theme => theme.shape.borderRadius,
								width: '100%',
								height: '100%'
							}}
						>
							<iframe
								src={docToUse.url}
								style={{
									width: '100%',
									height: '100%',
									border: 'none',
									borderRadius: 8
								}}
								referrerPolicy='strict-origin'
								title={docToUse.asset.name}
							/>
						</Paper>
					) : null} */}
				</Paper>
				{docs.length > 1 ? (
					<IconButton
						icon='next'
						label='Next'
						onClick={handleOnNext}
						sx={{ marginLeft: theme => theme.spacing(constants.SPACING) }}
						color='inherit'
					/>
				) : null}
			</Box>
		</Backdrop>
	);
};
