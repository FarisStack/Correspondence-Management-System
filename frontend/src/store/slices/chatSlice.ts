import { createSlice, PayloadAction } from '@reduxjs/toolkit'



export interface ChatState {
    selectedChat: any;
    chats: any,
}


const initialState: ChatState = {
    selectedChat: {},
    chats: []
}

export const chatSlice = createSlice({
    name: 'chat', //Creating a slice requires a string name to identify the slice
    initialState, //an initial state value
    reducers: {
        // Here we put one or more reducer functions to define how the state can be updated.
        // NOTE: There is something called the reducer function for the whole slice, and there are also
        // these functions inside the reducers: {} are sometimes called case reducer functions, 
        // also known as: Action Creators.
        setSelectedChat: (state: ChatState, { payload }: any) => {
            console.log("payload: ", payload);
            // state.selectedChat = payload;
            return { ...state, selectedChat: payload };
        },
        setChats: (state: ChatState, { payload }: PayloadAction<object>) => {
            // state.chats = payload;
            return { ...state, chats: payload };
        }
    },
});

// ACTION CREATORS are generated for each case reducer function
export const { setSelectedChat, setChats } = chatSlice.actions;
//snackbarSlice.actions returns the `reducers: ` object, which contains all Action Creators


export default chatSlice.reducer //this is the reducer function for the whole slice.

/*
  Once a slice is created, we can export the generated Redux action creators 
  and the reducer function for the whole slice.
*/