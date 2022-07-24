import React, { useState } from 'react'
import PropTypes from 'prop-types'
// ------------------ React Pro Sidebar ---------------------------
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from 'react-pro-sidebar';
// ------------------- React Pro Sidebar Styles CSS -------------------
// import 'react-pro-sidebar/dist/css/styles.css';
// import '../Sass/Demo.scss';
// import sidebarCSS from "../css/sidebar.module.css";
import "../css/sidebar.css";

// ----------------------------------------------------------------
// ========== FontAwesome Icons: =================================
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from '@fortawesome/free-solid-svg-icons';
// ------------ FontAwesome but from "react-icons/fa" --------------------
import {
    FaTachometerAlt, FaGem, FaList, FaGithub,
    FaRegLaughWink, FaHeart, FaGuilded
}
    from 'react-icons/fa';
import { CgMenu } from "react-icons/cg";
import HomeIcon from '@mui/icons-material/Home';
// ------------------------ MUI Components ------------------------
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// ----------------- React-Icons: ------------------------
import AiOutlineDoubleLeft from "react-icons/ai";

// ----------------- MUI Icons: ------------------------
import MailIcon from '@mui/icons-material/Mail';
import ChatIcon from '@mui/icons-material/Chat';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useDispatch } from 'react-redux';
// ------------------ React Router Dom --------------------
import { Link, Outlet, useNavigate } from 'react-router-dom'
import useAuth from "../store/hooks/useAuth";
import { logoutUser } from "../store/slices/loginSlice";
// ------------------ API functions ---------------------------
import { handleLogout } from "./Auth/api/authApi";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Aside = ({ collapsed, setCollapsed, toggled, handleToggleSidebar }) => {

    const authState = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let flag = true;

    return (
        <ProSidebar
            collapsed={collapsed}
            toggled={toggled}
            onToggle={handleToggleSidebar}

        >
            <SidebarHeader>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px 0px",
                    }}
                >
                    <Tooltip title={collapsed ? "expand" : "collapse"}>
                        <IconButton
                            aria-label="expand/collapse sidebar"
                            component="span"
                            style={{
                                cursor: "pointer",
                                // backgroundColor: "#2b2b2b",
                                backgroundColor: "hsla(0,0%,100%,.05)",
                            }}
                            className={collapsed ? "rotate180" : null}
                            onClick={() => {
                                setCollapsed(!collapsed)
                            }}
                        >
                            <KeyboardDoubleArrowLeftIcon
                                style={{ color: "#adadad" }}
                            />
                        </IconButton>
                    </Tooltip>
                    {/* Ratoon system */}
                </div>
            </SidebarHeader>


            <SidebarContent>
                <Menu iconShape="circle">
                    {/* dashboard */}
                    <MenuItem
                        icon={<HomeIcon />}
                    // suffix={<span className="badge red">new</span>}
                    >
                        <Link to="/">Dashboard</Link>
                    </MenuItem>
                </Menu>


                <Menu iconShape="circle" subMenuBullets='true'>
                    <SubMenu
                        // suffix={<span className="badge yellow">3</span>}
                        title="Workflow"
                        icon={<MailIcon />}
                    >
                        <MenuItem><Link to="/create-workflow">Create Workflow</Link></MenuItem>
                        <MenuItem><Link to="/workflow/inbox">Inbox</Link></MenuItem>
                        <MenuItem><Link to="/workflow/follow-up">Follow-up</Link></MenuItem>
                        <MenuItem><Link to="/workflow/cc">CC</Link></MenuItem>
                        <MenuItem><Link to="/workflow/archive">Archive</Link></MenuItem>
                    </SubMenu>

                    <SubMenu
                        // suffix={<span className="badge yellow">3</span>}
                        title="Chat"
                        icon={<ChatIcon />}
                    >
                        {/* <MenuItem><Link to="/chat">Auth</Link></MenuItem> */}
                        <MenuItem><Link to="/chat/home">Chat</Link></MenuItem>
                    </SubMenu>

                    <SubMenu
                        // prefix={<span className="badge gray">3</span>}
                        title="Employee"
                        icon={<AccountCircleIcon />}
                    >
                        <MenuItem><Link to="/update-employee-info">My profile</Link></MenuItem>
                        <MenuItem><Link to="/employees">Employees</Link></MenuItem>
                        {
                            authState?.user?.role === "admin" ? (
                                <>
                                    <MenuItem><Link to="/add-employee">Add new employee</Link></MenuItem>
                                    <MenuItem><Link to="/add-positions">Build positions</Link></MenuItem>
                                </>
                            ) : null
                        }
                    </SubMenu>


                    {/* 
                    <SubMenu title="multiLevel" icon={<FaList />}>
                        <MenuItem>submenu 1 </MenuItem>
                        <MenuItem>submenu 2 </MenuItem>
                        <SubMenu title={`submenu 3`}>
                            <MenuItem>submenu 3.1 </MenuItem>
                            <MenuItem>submenu 3.2 </MenuItem>
                            <SubMenu title={`submenu 3.3`}>
                                <MenuItem>submenu 3.3.1 </MenuItem>
                                <MenuItem>submenu 3.3.2 </MenuItem>
                                <MenuItem>submenu 3.3.3 </MenuItem>
                            </SubMenu>
                        </SubMenu>
                    </SubMenu> */}
                    {/* logout */}
                    {/* <br /> */}
                    {/* <hr /> */}
                    {/* <br /> */}
                    {/* <div
                        className="sidebar-btn-wrapper"
                        style={{
                            padding: '20px 24px',
                            color: 'red',
                        }}  >
                    </div> */}
                </Menu>

                <Menu>
                    <Divider style={{ borderColor: "rgba(255,255,255, 0.2)" }} />
                    {authState.isAuth && (
                        <Tooltip title="Logout">
                            <MenuItem
                                icon={<LogoutIcon />}
                                onClick={() => handleLogout(dispatch, logoutUser, navigate)}
                            >
                                Logout
                            </MenuItem>
                        </Tooltip>
                    )}
                </Menu>
                {/* <span className="myBtnCollapse">
                    <CgMenu className='iconCollapsed'  onClick={() => {
                        setCollapsed(!collapsed)
                       
                    }} />
                </span> */}
            </SidebarContent>


            <SidebarFooter style={{ textAlign: 'center' }}>
                {/* <div
                    className="sidebar-btn-wrapper"
                    style={{
                        padding: '20px 24px',
                    }}  >    </div> */}
            </SidebarFooter>
        </ProSidebar >
    )
}

Aside.propTypes = {

}

export default Aside