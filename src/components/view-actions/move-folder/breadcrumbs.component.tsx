import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { assetsAtom } from 'lib/recoil';
import { getUrlPathToAsset } from 'lib/url';
import { Box } from 'ui-components/box';
import { Icon } from 'ui-components/icon';
import { Caption } from 'ui-components/typography';

export const MoveFolderBreadcrumbs = ({
	parentAssetId,
	onBreadcrumbClick
}: {
	parentAssetId: number;
	onBreadcrumbClick: (assetId: number) => void;
}) => {
	const { assets } = useRecoilValue(assetsAtom);

	const breadcrumbs = useMemo(() => {
		return getUrlPathToAsset(parentAssetId, assets);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parentAssetId]);

	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'wrap',
				marginTop: 1.5,
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
			{parentAssetId > 0 ? (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center'
					}}
					onClick={() => onBreadcrumbClick(0)}
				>
					<Caption title='DappBox' />
					<Icon
						icon='next'
						spacingLeft
						spacingRight
						sx={{
							fontSize: theme => theme.typography.fontSize
						}}
					/>
				</Box>
			) : null}
			{breadcrumbs.map((breadcrumb, index) => (
				<Box
					key={breadcrumb.assetId}
					sx={{
						display: 'flex',
						alignItems: 'center'
					}}
					onClick={() => onBreadcrumbClick(breadcrumb.assetId)}
				>
					<Caption title={breadcrumb.name} />
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
