// import React from 'react'
// --------- React-Router-Dom ---------------
import { useLocation, Location, Navigate, Outlet } from "react-router-dom";
// ---------- Redux Toolkit My Store -----------
import useAuth from "../../store/hooks/useAuth"; // our custom hook to manage the auth state
import { LoginState } from "../../store/slices/loginSlice";

type RequireAuthType = {
    allowedRoles: Array<string>;
}

const RequireAuth = ({ allowedRoles }: RequireAuthType) => {
    const authState: LoginState = useAuth(); //returns `state.login` from our redux store
    const location: Location = useLocation(); //returns the current location object, which represents the current URL in web browsers.

    return (
        allowedRoles?.includes(authState?.user?.role)
            ? <Outlet /> //show the component which is wrapped inside the protected route
            : authState?.isAuth
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth