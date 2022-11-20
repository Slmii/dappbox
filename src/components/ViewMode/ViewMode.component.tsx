import { useState } from 'react';

import { ToggleGroup } from 'ui-components/ToggleGroup';

export const ViewMode = () => {
	const [viewMode, setViewMode] = useState('list');

	const handleOnViewModeChange = (viewMode: string | null) => {
		if (viewMode !== null) {
			setViewMode(viewMode);
		}
	};

	return (
		<ToggleGroup
			options={[
				{
					icon: 'list',
					value: 'list',
					label: 'List'
				},
				{
					icon: 'grid',
					value: 'grid',
					label: 'Grid'
				}
			]}
			selected={viewMode}
			onChange={handleOnViewModeChange}
		/>
	);
};
