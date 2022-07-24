import * as React from 'react';
import imgLogo from "../logo.png";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

// ---------------------- MUI ICONS ------------------------
import AdbIcon from '@mui/icons-material/Adb';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// ---------------------- React-Icons ------------------------
import { FaMailchimp } from "react-icons/fa";
import { IoLogoReact } from "react-icons/io5";
// ---------------------- MUI Colors ------------------------
import { deepOrange, deepPurple, pink } from '@mui/material/colors';

// --------------- CSS ---------------------
import classes from "../css/Navbar.module.css"

// ------------------ API functions ---------------------------
import { handleLogout } from "./Auth/api/authApi";
// ------------------ Redux ---------------------------
import { IEmployeePositionObj, LoginState, logoutUser } from "../store/slices/loginSlice";
import { setSnackbar, ISeverity } from "../store/slices/snackbarSlice";
import { useDispatch, useSelector } from 'react-redux';
// ------------------ My Custom Hook to return the login state: ---------------------------
import useAuth from '../store/hooks/useAuth';
// ------------------ React-router-dom ---------------------------
import { useNavigate } from "react-router-dom"
// ---------------------------------------------------
import axiosInstance from "../api/axios";
import { AxiosResponse } from 'axios';

const pages = ['Profile', 'Dashboard'];
const settings = [
    { label: "Profile", link: "update-employee-info" },
    { label: "Dashboard", link: "" },
];
// const allEmployeePositions = ["Prof. Assistant", "Head of CSE Dep."]



export default function MenuAppBar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const authState:LoginState = useSelector((state: RootState) => state.login);
    const authState: LoginState = useAuth(); //returns `state.login` from our redux store

    React.useEffect(() => {
        getEmployeeCurrentPosition();
        getEmployeeAvatar();
    }, [authState])

    const [userAvatar, setUserAvatar] = React.useState<string | null>(null);
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElSwitchPosition, setAnchorElSwitchPosition] = React.useState<null | HTMLElement>(null);
    const [employeeCurrentPosition, setEmployeeCurrentPosition] = React.useState<IEmployeePositionObj>({ id: -1, title: "Invalid" })


    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
        console.log("ElNav: ", event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
        console.log("ElUser: ", event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    const handleOpenSwitchPositionMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElSwitchPosition(event.currentTarget);
        console.log("ElSwitchPosition: ", event.currentTarget);
    };
    const handleCloseSwitchPositionMenu = () => {
        setAnchorElSwitchPosition(null);
    };

    const switchEmployeeCurrentPosition = (newEmpPosObj: IEmployeePositionObj) => {

        if (employeeCurrentPosition.id === newEmpPosObj.id) {
            // then no need to switch the account because the user has clicked the position which he/she is currently logged in as.
            return;
        }
        else {
            setEmployeeCurrentPosition(newEmpPosObj); // set the state
            // --- Don't forget to update the `employeeCurrentPositionId` in the localStorage:
            localStorage.setItem("employeeCurrentPositionId", newEmpPosObj.id + "");
            // --- Finally, make query to update the `lastLoginPositionId` field in the 'Accounts` table, so that when the user is logs out then logs in again, his/her position will be the last position he/she switched into:
            axiosInstance().put("/employee/updateLastLoginPositionId", {
                employeeCurrentPositionId: newEmpPosObj.id
            }).then((response: any) => {
                dispatch(
                    setSnackbar({
                        snackbarOpen: true,
                        snackbarType: ISeverity.INFO,
                        snackbarMessage: response.data.message,
                    })
                )
                // --- Refresh the app so that for example if I am on my inbox page and switched to another position, I can see a different inbox:
                setTimeout(function () {
                    // Delay the refresh to give the user some time to read the snackbar message:
                    window.location.reload();
                }, 1500);
            }).catch((error: any) => console.log(error))
        }
    }

    const getEmployeeCurrentPosition = (): IEmployeePositionObj => {
        const employeeCurrentPositionId = localStorage.getItem("employeeCurrentPositionId");

        if (employeeCurrentPositionId === null) {
            return employeeCurrentPosition; //return the current value of the state `employeeCurrentPosition`
        }
        else {
            const empCurrPos: IEmployeePositionObj = authState.user.allEmployeePositions.find(
                (empPos: IEmployeePositionObj) => +empPos.id === +employeeCurrentPositionId
            );

            if (empCurrPos) {
                setEmployeeCurrentPosition(empCurrPos);
            }

            return empCurrPos;
        }
    }
    const getEmployeeAvatar = () => {
        axiosInstance().get("employee/avatar").then((response: AxiosResponse) => {
            setUserAvatar(response.data.avatar);
        }).catch((error: any) => console.log(error));
    }

    return (
        <AppBar
            position="fixed"
            sx={{ padding: "0px" }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "space-between",
                }}
            >
                {/* -------------------- LOGO --------------------- */}
                <section
                    style={{ display: "flex", alignItems: "center" }}
                >
                    {/* <IoLogoReact
                        style={{ display: "flex", marginRight: "10px", fontSize: "2.3rem" }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            // display: { xs: 'none', md: 'flex' },
                            display: "flex",
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        RATOON
                    </Typography> */}
                    {/* ---------- Sondos Logo ----------- */}

                    <span
                        style={{ cursor: "pointer", }}
                    >
                        <img
                            src={imgLogo}
                            alt="Logo"
                            onClick={() => navigate("/")}
                        />
                    </span>
                </section>
                {/* -------------------- End LOGO --------------------- */}

                {/* -- This is the Menu on the lift (appears on small screens as Hamburger) --- */}
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        {pages.map((page) => (
                            <MenuItem key={page} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">{page}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                {/* --------------------- End the menu on the left --------------------- */}

                <Box
                    sx={{ display: "flex" }}
                >
                    {/* ---------- Switch Account (Current User Emp Positions) --------- */}
                    {/* ----- Make this visible only for users who have more than one position ---- */}

                    <Box
                        sx={{
                            display: "flex",
                            "&:hover, &:focus, &:active": {
                                backgroundColor: "#1769aa"
                            }
                        }}
                    >
                        <Tooltip title="Switch account">
                            <Button
                                onClick={handleOpenSwitchPositionMenu}
                                sx={{
                                    gap: "7px",
                                }}
                            >
                                <SwitchAccountIcon
                                    sx={{ color: "white" }}
                                />
                                <Typography
                                    sx={{
                                        color: "white",
                                        textTransform: "none",
                                        display: { xs: "none", md: "block" }
                                    }}
                                >
                                    {employeeCurrentPosition.title}
                                </Typography>
                                <ExpandMoreIcon
                                    className={anchorElSwitchPosition ? classes.chevron : ""}
                                    sx={{
                                        color: "white",
                                        display: { xs: "none", md: "block" }
                                    }}
                                />
                            </Button>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="switch-user-emp-position"
                            anchorEl={anchorElSwitchPosition}
                            // anchorEl: An HTML element, or a function that returns an HTML element. It's used to set the position of the menu.
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            open={Boolean(anchorElSwitchPosition)}
                            onClose={handleCloseSwitchPositionMenu}
                        >
                            {authState.user.allEmployeePositions.map((empPos: IEmployeePositionObj) => (
                                <MenuItem
                                    key={empPos.id}
                                    onClick={() => switchEmployeeCurrentPosition(empPos)}
                                >
                                    <Typography textAlign="center">{empPos.title}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* ---------- End Switch Account (Current User Emp Positions) --------- */}

                    {/* ---------------- Current User Settings Anchor ----------------- */}
                    <Box
                        sx={{
                            display: "flex",
                            "&:hover, &:focus, &:active": {
                                backgroundColor: "#1769aa"
                            }
                        }}
                    >
                        <Tooltip title="Open settings">
                            <Button
                                onClick={handleOpenUserMenu}
                                sx={{
                                    gap: "7px",
                                }}
                            >
                                <Avatar
                                    alt={`avatar of ${authState.user.fullName}`}
                                    src={`${userAvatar !== null && `${process.env.REACT_APP_UPLOADS_URL}avatars/${userAvatar}`}`}
                                    className={classes.userAvatar}
                                    sx={{ bgcolor: pink[300] }}
                                // sx={{
                                //     width: "50px",
                                //     height: "50px",
                                //     border: "2px solid ghostwhite",
                                // }}
                                >
                                    {authState.user.fullName.charAt(0)}
                                </Avatar>
                                <Typography
                                    sx={{
                                        color: "white",
                                        textTransform: "none",
                                        display: { xs: "none", md: "block" }
                                    }}
                                >
                                    {authState.user.fullName}
                                </Typography>
                                <ExpandMoreIcon
                                    className={anchorElUser ? classes.chevron : ""}
                                    sx={{
                                        color: "white",
                                        display: { xs: "none", md: "block" }
                                    }} />
                            </Button>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="current-user-settings"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting.label}
                                    sx={{ width: "160px" }}
                                    onClick={() => navigate(`/${setting.link}`)}
                                >
                                    <Typography textAlign="center">{setting.label}</Typography>
                                </MenuItem>
                            ))}

                            <MenuItem
                                key="logout"
                                onClick={() => handleLogout(dispatch, logoutUser, navigate)}
                                sx={{ width: "160px" }}
                            >
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    {/* ---------------- End Current User Settings Anchor ----------------- */}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
