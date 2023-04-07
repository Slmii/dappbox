import { useMemo } from 'react';

import { SPACING } from 'lib/constants/spacing.constants';
import { useUserAssets } from 'lib/hooks';
import { getUrlPathToAsset } from 'lib/url';
import { Box } from 'ui-components/Box';
import { Icon } from 'ui-components/Icon';
import { Caption } from 'ui-components/Typography';

export const MoveFolderBreadcrumbs = ({
	parentAssetId,
	onBreadcrumbClick
}: {
	parentAssetId: number;
	onBreadcrumbClick: (assetId: number) => void;
}) => {
	const { data: assets } = useUserAssets();

	const breadcrumbs = useMemo(() => {
		if (!assets) {
			return [];
		}

		return getUrlPathToAsset(parentAssetId, assets);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parentAssetId, assets]);

	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'wrap',
				marginTop: SPACING,
				'& > *:not(:last-child) > span': {
					color: 'text.secondary',
					'&:hover': {
						textDecoration: 'underline',
						cursor: 'pointer'
					}
				},
				'& > *:last-child > span': {
					color: 'text.primary',
					fontWeight: 'bold'
				}
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center'
				}}
				onClick={() => onBreadcrumbClick(0)}
			>
				<Caption>Home</Caption>
				{parentAssetId > 0 ? (
					<Icon
						icon='next'
						spacingLeft
						spacingRight
						sx={{
							fontSize: theme => theme.typography.fontSize
						}}
					/>
				) : null}
			</Box>
			{breadcrumbs.map((breadcrumb, index) => (
				<Box
					key={breadcrumb.id}
					sx={{
						display: 'flex',
						alignItems: 'center'
					}}
					onClick={() => onBreadcrumbClick(breadcrumb.id)}
				>
					<Caption>{breadcrumb.name}</Caption>
					{breadcrumbs.length !== index + 1 && (
						<Icon
							icon='next'
							spacingLeft
							spacingRight
							sx={{
								fontSize: theme => theme.typography.fontSize
							}}
						/>
					)}
				</Box>
			))}
		</Box>
	);
};
