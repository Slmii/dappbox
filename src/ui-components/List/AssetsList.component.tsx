import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Icon } from 'ui-components/Icon';
import { AssetsListProps } from './List.types';

export const AssetsList = ({ assets }: AssetsListProps) => {
	return (
		<List>
			{assets.map(asset => (
				<ListItem
					key={asset.id}
					disablePadding
					secondaryAction={asset.secondaryAction}
					disabled={asset.disabled}
				>
					<ListItemButton onClick={() => asset.onClick?.(asset.id)} selected={asset.isSelected}>
						{asset.icon ? (
							<ListItemIcon>
								<Icon icon={asset.icon} color='info' spacingRight />
							</ListItemIcon>
						) : null}
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
