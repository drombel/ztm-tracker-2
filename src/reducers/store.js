import { configureStore } from '@reduxjs/toolkit';
import markerReducer from './marker/markerReducer';
import busesReducer from './buses/busesReducer';
import routesReducer from './routes/routesReducer';
import settingsReducer from './settings/settingsReducer';

export default configureStore({
  reducer: {
    marker: markerReducer,
    buses: busesReducer,
    routes: routesReducer,
    settings: settingsReducer,
  }
})