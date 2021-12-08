import { createSlice } from '@reduxjs/toolkit'

export const routesSlice = createSlice({
  name: 'routes',
  initialState: [],
  reducers: {
    setRoutes: (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length > 0)
        return action.payload;
    },
  }
})

export const { setRoutes } = routesSlice.actions

export default routesSlice.reducer