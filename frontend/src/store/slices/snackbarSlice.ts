import { createSlice, current } from '@reduxjs/toolkit'


export enum ISeverity {
    SUCCESS = "success", // green
    ERROR = "error", // red
    WARNING = "warning", // orange
    INFO = "info", // blue
}
export enum IVariant {
    FILLED = "filled", 
    OUTLINED = "outlined", 
    STANDARD = "standard",
}
export enum IVertical {
    TOP = "top",
    BOTTOM = "bottom"
}
export enum IHorizontal {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}

export interface ISnackbarState {
    snackbarOpen: Boolean;
    snackbarType?: ISeverity,
    snackbarVariant?: IVariant,
    snackbarMessage?: string,
    vertical?: IVertical,
    horizontal?: IHorizontal,
    autoHideDuration?: number | null,
    // for example: if we want to show a confirm dialog, we pass 2 buttons "Ok", and "Cancel"
    // to be rendered inside the snackbar alert.
}

const initialState: ISnackbarState = {
    snackbarOpen: false,
    snackbarType: ISeverity.SUCCESS,
    snackbarVariant: IVariant.STANDARD,
    snackbarMessage: "",
    vertical: IVertical.BOTTOM,
    horizontal: IHorizontal.LEFT,
    autoHideDuration: null, 
};


export const snackbarSlice = createSlice({
    name: 'snackbar', //Creating a slice requires a string name to identify the slice
    initialState, //an initial state value
    reducers: {
        // Here we put one or more reducer functions to define how the state can be updated.
        // NOTE: There is something called the reducer function for the whole slice, and there are also
        // these functions inside the reducers: {} are sometimes called case reducer functions, 
        // also known as: Action Creators.
        setSnackbar: (state: ISnackbarState, action: any) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state = current(state);
            // console.log(state);
            state = action.payload;
            // console.log(state);
            return state;
            // return action.payload; // return a new state
        },
    },
})

// ACTION CREATORS are generated for each case reducer function
export const { setSnackbar } = snackbarSlice.actions;
//snackbarSlice.actions returns the `reducers: ` object, which contains all Action Creators


export default snackbarSlice.reducer //this is the reducer function for the whole slice.

/*
  Once a slice is created, we can export the generated Redux action creators 
  and the reducer function for the whole slice.
*/