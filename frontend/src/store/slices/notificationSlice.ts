import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

export interface NotificationState {
    test?: any,
    notificationsList: any[],
}


const initialState: NotificationState = {
    notificationsList: []
}

export const notificationSlice = createSlice({
    name: 'notification', //Creating a slice requires a string name to identify the slice
    initialState, //an initial state value
    reducers: {
        // Here we put one or more reducer functions to define how the state can be updated.
        // NOTE: There is something called the reducer function for the whole slice, and there are also
        // these functions inside the reducers: {} are sometimes called case reducer functions, 
        // also known as: Action Creators.
        setNotificationsList: (state: NotificationState, { payload }: any) => {
            console.log("payload: ", payload);
            // state.notificationsList = payload;
            // return {...state, notificationsList: [...state.notificationsList, payload]};
            return { ...state, notificationsList: payload };
        },
    },
});

// ACTION CREATORS are generated for each case reducer function
export const { setNotificationsList } = notificationSlice.actions;
//snackbarSlice.actions returns the `reducers: ` object, which contains all Action Creators


export default notificationSlice.reducer //this is the reducer function for the whole slice.

/*
  Once a slice is created, we can export the generated Redux action creators 
  and the reducer function for the whole slice.
*/