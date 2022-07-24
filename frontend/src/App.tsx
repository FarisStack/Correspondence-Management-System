import { FC, useEffect, Fragment, useState, EffectCallback } from 'react';
// ----------------------- React Router Dom -----------------------------------
import { useNavigate } from 'react-router-dom'
// ============ Our Styles: ===================
import "./css/App.css";
// ------------- All App Routes 👇 -------------------
import MainRoutes from './Routes'
// ------------------- Components outside the Routes.jsx -----------------
import Snackbar from "./components/Snackbar/Snackbar"; // Snackbar is a MUI Notification Alert
import ConfirmDialog from './components/Confirm/ConfirmDialog';
import Scroll from "./components/Others/Scroll";

// ---------------- Redux Toolkit -------------------------
import { useSelector, useDispatch } from "react-redux";
import { LoginState, loginSuccess, loginFail } from './store/slices/loginSlice';
import { setSnackbar, ISeverity } from "./store/slices/snackbarSlice";
import { RootState } from "./store";

// ---------------- Axios -------------------------
import axiosInstance from "./api/axios";
// ------------------ API functions ---------------------------
import { checkAutoLogin } from "./components/Auth/api/authApi";

type Props = {}


const App: FC<Props> = (props: Props): any => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  let authState: LoginState = useSelector((state: RootState) => state.login);

  const [refreshing, setRefreshing] = useState(true);

  useEffect((): ReturnType<EffectCallback> => {
    let mounted = true;
    // -------------- checkAutoLogin when User refreshes the app --------------
    setRefreshing(true);
    axiosInstance().get(`auth/verifyToken`).then((response) => {
      const { tokenVerified } = response.data;
      console.log(tokenVerified);
      if (tokenVerified) {
        const { user } = response.data; // `user` is an objet stores the decoded payload which that was stored about this user when he logged in. So, now we need this decoded payload to store it in our global redux state `login.user`
        dispatch(loginSuccess(user));
        // setRefreshing(false); // this line must be here, not outside the then(), to guarantee that it will only setRefreshing(false) after the asynchronous request is done and the response is received and processed
      }
      else {
        const { message } = response.data;
        console.log(message);
        // dispatch(
        //   setSnackbar({
        //     snackbarOpen: true,
        //     snackbarType: ISeverity.ERROR,
        //     snackbarMessage: message,
        //   })
        // );
        dispatch(loginFail(message));
        // navigate("/login");
      }
      setRefreshing(false);
    });



    return () => {
      mounted = false
      setRefreshing(false);
    }; //cleanup function
    // -------------- End checkAutoLogin when User refreshes the app --------------

    // -------------- checkAutoLogin when User refreshes the app --------------
    // (async () => {
    //   setRefreshing(true);
    //   const resData = await checkAutoLogin(dispatch);
    //   setRefreshing(false);
    // })();
    // ----------------------------------------------------------------------
  }, []);

  return (
    <div className={`app`}>
      <Snackbar />
      <ConfirmDialog />
      <Scroll showBelow={250} />
      {refreshing ? (<div className="refreshing"><h1>Loading...</h1></div>) : (
        <MainRoutes />
      )}
    </div>
  );
}

export default App
