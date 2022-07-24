// ------ Note: This file `counterSlice` is just an example that I love to refer to when I want to revise how redux toolkit slice is built ------
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter', //Creating a slice requires a string name to identify the slice
  initialState, //an initial state value
  reducers: { 
    // Here we put one or more reducer functions to define how the state can be updated.
    // NOTE: There is something called the reducer function for the whole slice, and there are also
    // these functions inside the reducers: {} are sometimes called case reducer functions, 
    // also known as: Action Creators.
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

// ACTION CREATORS are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions


export default counterSlice.reducer //this is the reducer function for the whole slice.

/*
  Once a slice is created, we can export the generated Redux action creators 
  and the reducer function for the whole slice.
*/