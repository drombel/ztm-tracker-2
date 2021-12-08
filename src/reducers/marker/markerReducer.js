import { createSlice } from '@reduxjs/toolkit'

export const markerSlice = createSlice({
  name: 'marker',
  initialState: null,
  reducers: {
    setMarker: (state, action) => {
      return action.payload;
    },
    resetMarker: (state) => {
      return null;
    },
  }
})

export const { setMarker, resetMarker } = markerSlice.actions

export default markerSlice.reducer