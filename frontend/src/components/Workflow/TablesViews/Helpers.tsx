// ------------------- MUI ICONS -------------------
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
// ------------------- MUI IconButton -------------------
import IconButton from '@mui/material/IconButton';
// ------------------- react-icons -------------------
import { FaArchive } from 'react-icons/fa';
// ---------------- MUI Components --------------------
import Toolbar from '@mui/material/Toolbar';
import Tooltip from "@mui/material/Tooltip";
import Typography from '@mui/material/Typography';


// ---------------- TS Interfaces ----------------
export interface EnhancedTableToolbarProps {
    numSelected: number;
    tableCaption: string;
    toggleFilterExpansion: Function;
    moveToOrFromArchive: Function;
}

export const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected, tableCaption, toggleFilterExpansion, moveToOrFromArchive } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: "#E3EEFA"
                }),
            }}
            style={{ width: "98%", margin: "0 auto" }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="h1"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%', textTransform: "uppercase" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {tableCaption}
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip
                    title={tableCaption == "Archive" ? "Move from archive" : "Move to archive"}
                >
                    <IconButton
                        size="small"
                        onClick={() => moveToOrFromArchive()}
                    >
                        <FaArchive />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Go to filter box">
                    <IconButton
                        onClick={() => toggleFilterExpansion()}
                    >
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

