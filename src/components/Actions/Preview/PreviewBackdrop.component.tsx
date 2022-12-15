import { useMemo, useState } from 'react';

import { constants } from 'lib/constants';
import { Doc } from 'lib/types/Doc.types';
import { Backdrop } from 'ui-components/Backdrop';
import { Box, Column } from 'ui-components/Box';
import { IconButton } from 'ui-components/IconButton';
import { Paragraph } from 'ui-components/Typography';

export const PreviewBackdrop = ({ open, docs, onClick }: { open: boolean; docs: Doc[]; onClick: () => void }) => {
	const [previewIndex, setPreviewIndex] = useState(0);

	const handleOnPrevious = () => {
		if (previewIndex === 0) {
			setPreviewIndex(docs.length);
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

	const docToUse = useMemo(() => {
		return docs[previewIndex] ?? null;
	}, [docs, previewIndex]);

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
						<IconButton icon='close' label='Close' />
						<Paragraph>{docToUse?.name}</Paragraph>
					</Column>
					<Column>
						<IconButton icon='download' label='Download' />
						<IconButton icon='print' label='Print' onClick={() => window.print()} />
						<IconButton
							icon='newWindow'
							label='Open in new window'
							onClick={() => window.open(docToUse.url, '_blank')}
						/>
					</Column>
				</Box>
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center'
				}}
				onClick={e => e.stopPropagation()}
			>
				{docs.length > 1 ? (
					<IconButton
						icon='previous'
						label='Previous'
						onClick={handleOnPrevious}
						sx={{ marginRight: theme => theme.spacing(constants.SPACING) }}
					/>
				) : null}
				<Box
					sx={{
						maxWidth: 900,
						maxHeight: 900,
						overflow: 'hidden',
						display: 'block'
					}}
				>
					{docToUse && docToUse.mimeType.includes('image') ? (
						<img
							style={{
								height: '100%',
								width: '100%',
								objectFit: 'contain'
							}}
							src={docToUse.url}
							alt={docToUse.name}
						/>
					) : null}
					{docToUse && docToUse.mimeType.includes('pdf') ? <h1>Open in new tab</h1> : null}
				</Box>
				{docs.length > 1 ? (
					<IconButton
						icon='next'
						label='Next'
						onClick={handleOnNext}
						sx={{ marginLeft: theme => theme.spacing(constants.SPACING) }}
					/>
				) : null}
			</Box>
		</Backdrop>
	);
};
