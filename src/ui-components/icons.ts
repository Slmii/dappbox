import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CloseIcon from '@mui/icons-material/Close';

const icons = {
	darkMode: Brightness4Icon,
	lightMode: Brightness7Icon,
	account: AccountCircleIcon,
	close: CloseIcon,
	add: AddIcon
};

export type Icons = keyof typeof icons;
export { icons };
