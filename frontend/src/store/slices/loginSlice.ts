import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

// =============== Snackbar Notification Alert: ===========
import { useDispatch, useSelector } from "react-redux";
/* react-redux has 2 hooks: 
    1. useSelector: to access the states
    2. useDispatch: to modify/update/set the states 
*/

export interface UserStateObj {
    accountId: number;
    employeeId: number;
    fullName: string;
    role: any;
    allEmployeePositions: Array<IEmployeePositionObj>;
    employeePositionId: number;
}

export interface IEmployeePositionObj {
    id: number;
    title: string;
}

export interface LoginState {
    isLoading: Boolean;
    isAuth: Boolean,
    user: any,
    errorMessage: string,
}



const initialState: LoginState = {
    isLoading: false,
    isAuth: false,
    user: {
        // if isAuth: true, then store the logged in user's data here
        accountId: -1,
        employeeId: -1,
        fullName: "",
        role: "",
        allEmployeePositions: [],
        employeePositionId: -1
    },
    errorMessage: "",
}

export const loginSlice = createSlice({
    name: 'login', //Creating a slice requires a string name to identify the slice
    initialState, //an initial state value
    reducers: {
        // Here we put one or more reducer functions to define how the state can be updated.
        // NOTE: There is something called the reducer function for the whole slice, and there are also
        // these functions inside the reducers: {} are sometimes called case reducer functions, 
        // also known as: Action Creators.
        loginPending: (state: LoginState) => {
            state.isLoading = true;
        },
        loginSuccess: (state: LoginState, { payload }: PayloadAction<object>) => {
            state.isLoading = false;
            state.isAuth = true;
            state.user = payload;
            state.errorMessage = "";
        },
        loginFail: (state: LoginState, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuth = false;
            state.errorMessage = action.payload;
        },
        logoutUser: (state: LoginState) => {
            return initialState;
        }
    },
});

// ACTION CREATORS are generated for each case reducer function
export const { loginPending, loginSuccess, loginFail, logoutUser } = loginSlice.actions;
//snackbarSlice.actions returns the `reducers: ` object, which contains all Action Creators


export default loginSlice.reducer //this is the reducer function for the whole slice.

/*
  Once a slice is created, we can export the generated Redux action creators 
  and the reducer function for the whole slice.
*/