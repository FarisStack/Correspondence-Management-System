import React from 'react'
// ----------------------- React Router Dom -----------------------------------
import { BrowserRouter, Link, Route, Routes, useNavigate, Navigate } from 'react-router-dom'
// ============ Our Components: ===================
import WelcomeSlider from "./components/WelcomeSlider/Slider";
import Layout from "./components/Layout"
import RequireAuth from './components/Routes/RequireAuth';
import Missing from './components/Others/Missing'; // 404 Page Not Found
import Unauthorized from './components/Others/Unauthorized';

import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ForgotPasswordFaris from "./components/Auth/ForgotPasswordFaris";
import Verification from "./components/Auth/Verification";
import Dashboard from "./components/Dashboard/Dashboard";
import ActivateAccount from "./components/Auth/ActivateAccount";
import ResetPassword from "./components/Auth/ResetPassword";
import AddEmployee from './components/Employee/AddNewEmp/AddEmployee';
// ----------- Update Employee: -----------------
import PersonalPage from "./components/Employee/UpdateEmpInfo/PersonalPage";
import ManageEmployeePositions from "./components/Employee/UpdateEmpInfo/ManageEmployeePositions";
import ShowEmployees from "./components/Employee/SearchEmp/ShowEmployees";
// ----------- End Update Employee: -----------------

// import EmpOrgChart from "./components/OrgStructure/TreeChart";
// import BuildPositions from "./components/OrgStructure/BuildPositions";
import BuildPositions from "./components/Position/Position";
import CreateWorkflow from './components/Workflow/CreateWorkflow/CreateWorkflow';
import WorkflowActionsStack from "./components/Workflow/Actions/WorkflowActionsStack";
// ----------- Workflow Tables --------------------------
import InboxPage from "./components/Workflow/TablesViews/InboxPage";
import CcPage from "./components/Workflow/TablesViews/CcPage";
import FollowupPage from "./components/Workflow/TablesViews/FollowupPage";
import ArchivePage from "./components/Workflow/TablesViews/ArchivePage";
// ----------- Chat --------------------------
import ChatAuth from "./components/Chat/ChatAuth";
import ChatPage from "./components/Chat/ChatPage";


// ---------- Redux Toolkit My Store -----------
import { LoginState } from './store/slices/loginSlice';
import useAuth from './store/hooks/useAuth';

import Snackbar from "./components/Snackbar/Snackbar"; // Snackbar is a MUI Notification Alert


type Props = {}

const AppRoutes = (props: Props) => {

    const authState: LoginState = useAuth(); //returns `state.login` from our redux store


    const ROLES = {
        'Employee': "employee",
        'Admin': "admin",
    }
    // const ROLES = {
    //   'User': 2001,
    //   'Editor': 1984,
    //   'Admin': 5150
    // }

    return (
        <Routes>
            {/* <Route path="/thisDashboard" element={<Dashboard />} /> */}

            <Route path="/" element={<Layout />}>
                {/* public routes */}
                {/* <Route path="/" element={<WelcomeSlider />} /> */}


                {/* we want to protect these routes */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Employee, ROLES.Admin]} />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/create-workflow" element={<CreateWorkflow />} />
                    <Route path="/actions/:workflowId" element={<WorkflowActionsStack />} />
                    <Route path="/workflow/inbox" element={<InboxPage />} />
                    <Route path="/workflow/cc" element={<CcPage />} />
                    <Route path="/workflow/follow-up" element={<FollowupPage />} />
                    <Route path="/workflow/archive" element={<ArchivePage />} />
                    <Route path="/update-employee-info" element={<PersonalPage />} />
                    <Route path="/employees" element={<ShowEmployees />} />
                    <Route
                        path="/manage-employee-positions/:employeeId"
                        element={<ManageEmployeePositions />}
                    />

                    
                    <Route path="/chat" element={<ChatAuth />} />
                    <Route path="/chat/home" element={<ChatPage />} />
                </Route>


                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path="/add-employee" element={<AddEmployee />} />
                    <Route path="/add-positions" element={<BuildPositions />} />
                </Route>
            </Route>


            {/* catch all */}
            <Route path="login" element={<Login />} />
            <Route path="/auth/activate/:token" element={<ActivateAccount />} />
            <Route path="/auth/reset-password/:accountId/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password-faris" element={<ForgotPasswordFaris />} />
            <Route path="/verification" element={<Verification />} />

            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Missing />} />
        </Routes>
    )
}

export default AppRoutes