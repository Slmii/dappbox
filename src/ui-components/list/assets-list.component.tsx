import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Icon } from 'ui-components/icon';
import { IconButton } from 'ui-components/icon-button';
import { AssetsListProps } from './list.types';

export const AssetsList = ({ assets }: AssetsListProps) => {
	return (
		<List>
			{assets.map(asset => (
				<ListItem
					key={asset.assetId}
					disablePadding
					secondaryAction={
						asset.secondaryAction ? (
							<IconButton
								icon={asset.secondaryAction.icon}
								label={asset.secondaryAction.label}
								onClick={() => asset?.secondaryAction?.onClick(asset.assetId)}
							/>
						) : undefined
					}
				>
					<ListItemButton onClick={() => asset.onClick?.(asset.assetId)} selected={asset.isSelected}>
						{asset.icon && (
							<ListItemIcon>
								<Icon icon={asset.icon} color='info' spacingRight />
							</ListItemIcon>
						)}
						<ListItemText
							primary={asset.name}
							disableTypography
							sx={{
								fontSize: theme => theme.typography.fontSize
							}}
						/>
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
};
