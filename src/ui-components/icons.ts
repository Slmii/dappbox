import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CloseIcon from '@mui/icons-material/Close';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FeedbackIcon from '@mui/icons-material/Feedback';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import ListIcon from '@mui/icons-material/List';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
	viewOff: VisibilityOffIcon,
	download: DownloadIcon,
	downloadOutlined: DownloadOutlinedIcon,
	copy: FileCopyIcon,
	copyOutlined: FileCopyOutlinedIcon,
	delete: DeleteIcon,
	deleteOutlined: DeleteOutlinedIcon,
	folder: FolderIcon,
	folderOutlined: FolderOpenOutlinedIcon,
	folderMove: DriveFileMoveIcon,
	folderMoveOutlined: DriveFileMoveOutlinedIcon,
	addFolder: CreateNewFolderIcon,
	addFolderOutlined: CreateNewFolderOutlinedIcon,
	favorite: FavoriteIcon,
	favoriteOutlined: FavoriteBorderIcon,
	more: MoreVertIcon,
	print: PrintIcon,
	share: ShareIcon,
	edit: EditIcon,
	expandMore: ExpandMoreIcon,
	expandLess: ExpandLessIcon,
	next: NavigateNextIcon,
	previous: NavigateBeforeIcon,
	logOut: PowerSettingsNewIcon,
	newWindow: OpenInNewIcon,
	uploadFile: UploadFileIcon,
	uploadFolder: DriveFolderUploadIcon,
	feedback: FeedbackIcon
};

export type Icons = keyof typeof icons;
export { icons };
