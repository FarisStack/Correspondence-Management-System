import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl';
/*What is react-intl? ANSWER: it is library from formatjs. It is a set of libraries that help you setup internationalization in any project whether it's React or not. */
import { useDispatch } from 'react-redux';
// ------------------ React Router Dom --------------------
import { Link, Outlet, useNavigate } from 'react-router-dom'
import useAuth from "../store/hooks/useAuth";
import { logoutUser } from "../store/slices/loginSlice";
// ------------------ API functions ---------------------------
import { handleLogout } from "./Auth/api/authApi";
// -------------------- Components ----------------------
import WelcomeSlider from "./WelcomeSlider/Slider";
import Aside from "./Aside";
import MyNavbar from "./MyNavbar";
import Snackbar from "./Snackbar/Snackbar";
import Scroll from "./Others/Scroll";
// -------------------- CSS Styles ----------------------
import "../css/layout.css";
import { FaHeart, FaBars } from 'react-icons/fa';



type Props = {}

const Layout = (props: Props) => {
    // const intl = useIntl();  // internationalization (just for formatting text)
    const authState = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ------------- States for Layout: -------------------
    const [collapsed, setCollapsed] = useState(true);
    const [toggled, setToggled] = useState(false);


    const handleCollapsedChange = () => {
        setCollapsed(!collapsed);
    };

    const handleToggleSidebar = (value: boolean) => {
        setToggled(!toggled);
        console.log(!toggled);
    };



    return (
        // <nav>
        //     <Link to="/">  Home  </Link>
        //     <Link to="/profile/1">  Profile  </Link>
        //     <Link to="/add-employee">  Add Employee  </Link>
        //     <Link to="/add-positions">  Build Positions  </Link>
        //     {!authState.isAuth ?
        //         (<Link to="/login"><button>Login</button></Link>) :
        //         (<button onClick={() => handleLogout(dispatch, logoutUser, navigate)}>Logout</button>)
        //     }
        //     <Outlet />
        // </nav>
        <Fragment>
            {authState.isAuth
                ? (
                    <>
                        <Aside
                            collapsed={collapsed}
                            setCollapsed={setCollapsed}
                            toggled={toggled}
                            handleToggleSidebar={handleToggleSidebar}
                        />
                        <MyNavbar />
                        <div
                            className={`PD_TOP ${collapsed ? "PD_LEFT_80" : "PD_LEFT_270"}`}
                        >
                            <Snackbar />
                            <Outlet />
                        </div>
                    </>
                )
                : (
                    <WelcomeSlider />
                )}

        </Fragment>
    )
}

export default Layout