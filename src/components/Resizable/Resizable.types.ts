export interface ResizableProps {
	width: number;
	height: number;
	fullScreen?: boolean;
	isDraggable?: boolean;
	onResize?: (height: number) => void;
}
