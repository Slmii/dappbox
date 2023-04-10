import Paper from '@mui/material/Paper';
import { useMemo, useState } from 'react';

import { SPACING } from 'lib/constants/spacing.constants';
import { useDownload, useKeyPress } from 'lib/hooks';
import { Asset, Doc } from 'lib/types';
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

	const isPreviewSupported = useMemo(() => {
		if (!docToUse || typeof docToUse.asset.mimeType === 'undefined') {
			return true;
		}

		if (docToUse.asset.mimeType.includes('image')) {
			return true;
		}

		if (docToUse.asset.mimeType.includes('audio')) {
			return true;
		}

		if (docToUse.asset.mimeType.includes('video')) {
			return true;
		}

		if (excelMimeTypes.includes(docToUse.asset.mimeType)) {
			return true;
		}

		return false;
	}, [docToUse]);

	const nonFullScreenPreview = useMemo(() => {
		if (!docToUse || !docToUse.asset.mimeType) {
			return true;
		}

		if (docToUse.asset.mimeType.includes('image')) {
			return true;
		}

		if (docToUse.asset.mimeType.includes('audio')) {
			return true;
		}

		if (docToUse.asset.mimeType.includes('video')) {
			return true;
		}

		return false;
	}, [docToUse]);

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
					padding: theme => theme.spacing(SPACING)
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
						sx={{ marginRight: theme => theme.spacing(SPACING) }}
						color='inherit'
					/>
				) : null}
				<Paper
					elevation={1}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: theme => theme.spacing(SPACING),
						borderRadius: theme => theme.shape.borderRadius,
						width: '100%',
						height: '100%',
						overflowY: 'auto',
						background: nonFullScreenPreview ? 'unset' : undefined,
						backgroundImage: nonFullScreenPreview ? 'unset' : undefined
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
					{!isPreviewSupported ? (
						<Box sx={{ textAlign: 'center' }}>
							<Paragraph>Preview not supported.</Paragraph>
							<Paragraph>You can download the file and open it in your computer.</Paragraph>
						</Box>
					) : null}
				</Paper>
				{docs.length > 1 ? (
					<IconButton
						icon='next'
						label='Next'
						onClick={handleOnNext}
						sx={{ marginLeft: theme => theme.spacing(SPACING) }}
						color='inherit'
					/>
				) : null}
			</Box>
		</Backdrop>
	);
};
