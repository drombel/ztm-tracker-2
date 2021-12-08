import { createSlice } from '@reduxjs/toolkit'

export const busesSlice = createSlice({
  name: 'buses',
  initialState: [],
  reducers: {
    setBuses: (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length > 0)
        return action.payload;
    },
  }
})

export const { setBuses } = busesSlice.actions

export default busesSlice.reducer