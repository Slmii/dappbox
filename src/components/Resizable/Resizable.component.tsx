import { PropsWithChildren, useEffect, useState } from 'react';

import { Box } from 'ui-components/Box';
import { ResizableProps } from './Resizable.types';

export const Resizeable = ({
	width,
	height,
	isDraggable = true,
	fullScreen,
	children,
	onResize
}: PropsWithChildren<ResizableProps>) => {
	const [heightSize, setHeightSize] = useState(0);

	useEffect(() => {
		setHeightSize(height);
	}, [height]);

	const handler = (mouseDownEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (!isDraggable || fullScreen) {
			return;
		}

		function onMouseMove(mouseMoveEvent: MouseEvent) {
			let y = heightSize + mouseDownEvent.pageY - mouseMoveEvent.pageY;
			if (y <= 100) {
				y = 100;
			}

			if (y >= window.innerHeight) {
				y = window.innerHeight;
			}

			setHeightSize(y);
			onResize?.(y);
		}

		function onMouseUp() {
			document.body.removeEventListener('mousemove', onMouseMove);
			// document.body.removeEventListener('mouseup', onMouseUp);
		}

		document.body.addEventListener('mousemove', onMouseMove);
		document.body.addEventListener('mouseup', onMouseUp, { once: true });
	};

	return (
		<Box
			id='draggable'
			sx={{
				width: fullScreen ? window.innerWidth : width,
				height: fullScreen ? window.innerHeight : heightSize,
				position: 'relative',
				transition: !isDraggable && !fullScreen ? 'height 0.25s ease' : undefined
			}}
		>
			{isDraggable ? (
				<Box
					sx={{
						position: 'absolute',
						top: 8,
						left: 0,
						right: 0,
						marginLeft: 'auto',
						marginRight: 'auto',
						width: 30,
						height: 6,
						cursor: 'ns-resize',
						borderRadius: theme => theme.shape.borderRadius,
						backgroundColor: theme =>
							theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[900]
					}}
					onMouseDown={handler}
				/>
			) : null}
			{children}
		</Box>
	);
};
