import { useSelector } from "react-redux";
import { RootState } from ".."
import { LoginState } from "../slices/loginSlice"
/* react-redux has 2 hooks: 
    1. useSelector: to access the states
    2. useDispatch: to modify/update/set the states 
*/

// ----- a custom hook to return the `state.login` from redux
const useAuth = (): LoginState => {
    return useSelector((state: RootState) => state.login);
}

export default useAuth;