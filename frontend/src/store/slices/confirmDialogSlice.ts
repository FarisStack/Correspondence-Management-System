import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

export interface ConfirmDialogState {
    isOpen: Boolean;
    title: string;
    subtitle: string;
    onConfirm?: any;
}

const initialState: ConfirmDialogState = {
    isOpen: false,
    title: "",
    subtitle: '',
    onConfirm: null,
}

export const confirmDialogSlice = createSlice({
  name: 'confirmDialog', //Creating a slice requires a string name to identify the slice
  initialState, //an initial state value
  reducers: { 
    // Here we put one or more reducer functions to define how the state can be updated.
    // NOTE: There is something called the reducer function for the whole slice, and there are also
    // these functions inside the reducers: {} are sometimes called case reducer functions, 
    // also known as: Action Creators.
    setConfirmDialog: (state: any, action: any) => {
        state = current(state);
        // console.log(state);
        state = action.payload;
        // console.log(state);
        return state;
    },
  },
})

// ACTION CREATORS are generated for each case reducer function
export const { setConfirmDialog } = confirmDialogSlice.actions


export default confirmDialogSlice.reducer //this is the reducer function for the whole slice.

/*
  Once a slice is created, we can export the generated Redux action creators 
  and the reducer function for the whole slice.
*/