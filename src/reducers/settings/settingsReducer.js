import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  filters: {
    speed: 0,
    delay: '',
    route_stop: [],
    line: [],
  },
  options: {
    refresh: true,
    center: { lat: 54.3622393, lng: 18.5750017 },
    zoom: 15,
  }
};

export const markerSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    setRefresh: (state, action) => {
      state.options.refresh = !!action.payload;
    },
    setFilters: (state, action) => {
      let extra = {};
      
      if (action.payload.hasOwnProperty('speed'))      extra['speed'] = Math.max(Math.min(parseInt(action.payload.speed) || 0, 200), 0);
      if (action.payload.hasOwnProperty('delay'))      extra['delay'] = !isNaN(parseInt(action.payload.delay)) ? (parseInt(action.payload.delay) || 0) : (action.payload.delay === '-' ? '-' : '');
      if (action.payload.hasOwnProperty('route_stop')) extra['route_stop'] = Array.isArray(action.payload.route_stop) ? action.payload.route_stop : initialState.filters.route_stop;
      if (action.payload.hasOwnProperty('line'))       extra['line'] = Array.isArray(action.payload.line) ? action.payload?.line : initialState.filters.line;
      state.filters = { ...state.filters, ...extra };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setOptions: (state, action) => {
      state.options = {
        ...state.options,
        center: action.payload?.center ? action.payload?.center : state.center,
        zoom: action.payload?.center ? 17 : state.zoom,
      };
    },
    resetOptions: (state) => {
      state.filters = initialState.options;
    },
  }
})

export const { setRefresh, setFilters, resetFilters, setOptions, resetOptions, } = markerSlice.actions

export default markerSlice.reducer