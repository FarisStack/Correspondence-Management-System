import { combineReducers, configureStore } from "@reduxjs/toolkit";
// =============== My Reducers (Slices): =================
import snackbarReducer from './slices/snackbarSlice';//returns the reducer function for the whole slice.
import loginReducer from './slices/loginSlice';//returns the reducer function for the whole slice.
import confirmDialogReducer from './slices/confirmDialogSlice';//returns the reducer function for the whole slice.
import chatReducer from './slices/chatSlice';//returns the reducer function for the whole slice.
import notificationReducer from "./slices/notificationSlice";


// import { useSelector, useDispatch } from "react-redux";
/* react-redux has 2 hooks: 
    1. useSelector: to access the states
    2. useDispatch: to modify/update/set the states 
*/

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer, // now I can access this whole slice by `state.snackbar`
    login: loginReducer, // now I can access this whole slice by `state.login`
    confirmDialog: confirmDialogReducer, // now I can access this whole slice by `state.confirmDialog`
    chat: chatReducer,
    notification: notificationReducer,
  },
})


export const rootReducer = combineReducers({
  snackbar: snackbarReducer, 
  login: loginReducer, 
  confirmDialog: confirmDialogReducer,
  chat: chatReducer,
  notification: notificationReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch