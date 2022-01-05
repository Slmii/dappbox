import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CloseIcon from '@mui/icons-material/Close';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import ListIcon from '@mui/icons-material/List';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const icons = {
	darkMode: Brightness4Icon,
	lightMode: Brightness7Icon,
	account: AccountCircleIcon,
	close: CloseIcon,
	add: AddCircleIcon,
	addOutlined: AddOutlinedIcon,
	grid: ViewComfyIcon,
	list: ListIcon,
	view: VisibilityIcon,
	viewOutlined: VisibilityOutlinedIcon,
	download: DownloadIcon,
	downloadOutlined: DownloadOutlinedIcon,
	copy: FileCopyIcon,
	copyOutlined: FileCopyOutlinedIcon,
	delete: DeleteIcon,
	deleteOutlined: DeleteOutlinedIcon,
	folderOutlined: FolderOpenOutlinedIcon,
	addFolderOutlined: CreateNewFolderOutlinedIcon
};

export type Icons = keyof typeof icons;
export { icons };
