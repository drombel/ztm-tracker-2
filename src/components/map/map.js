// import { Wrapper, Status } from "@googlemaps/react-wrapper";
import React, { useEffect, useRef } from 'react';
import { Typography, Dialog, DialogTitle, TableContainer, Table, Paper, TableRow, TableCell, TableBody, Button, DialogContent, DialogActions, Fab } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setMarker, resetMarker } from '../../reducers/marker/markerReducer';
import { setBuses } from '../../reducers/buses/busesReducer';
import { setRoutes } from '../../reducers/routes/routesReducer';
import API from '../../utils/api';
import useFetch from 'use-http';
import './map.css';
import GoogleMapReact from 'google-map-react';

const Marker = ({ text = '', onClick = () => null }) => {
  return (
    <Fab color="primary" onClick={onClick} style={{ transform: 'translate(-50%, -50%)' }}>
      <Typography variant="body1">{text}</Typography>
    </Fab>
  );
};

function Map (){
  const busesFetch = useFetch(API.getBuses.url); // { get, response, loading, error }
  const routesFetch = useFetch(API.getRoutes.url); // { get, response, loading, error }
  const buses = useSelector(store => store.buses);
  const routes = useSelector(store => store.routes);
  const marker = useSelector(store => store.marker);
  const settings = useSelector(store => store.settings);
  const timeout = useRef({ buses: null, routes: null, });
  const dispatch = useDispatch();

  function loadBuses() {
    if (!settings.options.refresh) return;
    let data = [];
    busesFetch
      .get(`?date=${new Date().getTime()}`)
      .then(res => {
        data = Array.isArray(res?.Vehicles) ? res?.Vehicles?.filter(item => item.GPSQuality > 2) : [];
        if (data.length>0) dispatch(setBuses(data));
      })
  }

  function loadRoutes() {
    let data = [];
    routesFetch
      .get(`?date=${new Date().getTime()}`)
      .then(res => {
        const date = (new Date()).toISOString().split('T')[0];
        data = (!!res[date] && res[date]?.trips && Array.isArray(res[date]?.trips)) ? res[date].trips : [];
        if (data.length>0) dispatch(setRoutes(data));
      })
  }


  let popup = useRef(null);

  if (!!marker?.VehicleId) {
    const freshMarker = buses.find(item => item.VehicleId === marker.VehicleId)
    let popupData = {};
    if (freshMarker?.Delay !== 0){
      const time = new Date(Math.abs(freshMarker.Delay) * 1000).toISOString().substr(11, 8);
      const cond = freshMarker?.Delay > 0;
      popupData['delay'] = { title: 'Czas', value: (<span style={{color: (cond ? '#B00000' : '#00B000')}}>{cond ? 'Opóźniony' : 'Przed czasem'} {time}</span>) };
    }
    if (!!freshMarker?.Route){
      const route = routes.find(route => route.tripId === parseInt(freshMarker.Route) && route.routeId === parseInt(freshMarker.Line));
      if (!!route)
        popupData['route_stop'] = { title: 'Trasa', value: route.tripHeadsign };
    }
    if (!!freshMarker?.VehicleCode){
      popupData['vehicle_code'] = { title: 'Kod pojazdu', value: freshMarker.VehicleCode };
    }
    if (!!freshMarker?.Speed){
      popupData['speed'] = { title: 'Prędkość', value: `${freshMarker.Speed} km/h` };
    }

    popup.current = (
      <React.Fragment>
        <DialogTitle sx={{ textAlign: 'center' }}>{freshMarker.Line}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table aria-label="Dane autobusu">
              <TableBody>
                {Object.entries(popupData).map(([key, item]) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">{item.title}</TableCell>
                    <TableCell align="right">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(resetMarker())}>Zamknij</Button>
        </DialogActions>
      </React.Fragment>
    );
  }

  useEffect(() => {
    if (buses?.length === 0) loadBuses();
    clearInterval(timeout.current.buses)
    timeout.current.buses = setInterval(() => {
      loadBuses()
    }, 5000);
  }, [settings])

  const apiIsLoaded = () => {
    loadRoutes();
  };
  
  const handleMarkerClick = data => () => {
    dispatch(setMarker(data))
  };

  let filteredBuses = buses;
  // todo: pogrupować to do wspólnej zmiennej
  if (settings.filters.speed !== 0 || !['', '-'].includes(settings.filters.delay) || settings.filters.line.length > 0 || settings.filters.route_stop.length > 0) {
    filteredBuses = filteredBuses.filter(item => {
      let cond = true;
      cond &= settings.filters.speed !== 0 ? item.Speed >= settings.filters.speed : cond;
      cond &= !['', '-'].includes(settings.filters.delay) ? (item.Delay || 0) <= (settings.filters.delay*-1) : cond;
      cond &= settings.filters.line.length > 0 ? !!settings.filters.line.find(line => line.label == item.Line) : cond;
      cond &= settings.filters.route_stop.length > 0 ? !!settings.filters.route_stop.find(route => route.tripId === parseInt(item.Route) && route.routeId === parseInt(item.Line)) : cond;
      return cond;
    });
  }
  // TODO: dopisać do autocomplete przy route te dane tripId, routeId żeby można było odfiltrować dane, następnie odfiltrować, dodanie zaczytywania lokalizacji z tel,
  // wrzucić temu pajacowi i poprawić co się tu tylko da, oczyścić z nieużywanych paczek i warningów oraz opisać użyte paczki

  return (
    <React.Fragment>
      <div style={{ top: 0, bottom: 0, left: 0, right: 0, position: 'absolute' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
          defaultZoom={15}
          defaultCenter={{ lat: 54.3622393, lng: 18.5750017 }}
          zoom={settings.options.zoom}
          center={settings.options.center}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={() => apiIsLoaded()}
        >
          {filteredBuses.map((item) => (item.Lat && item.Lon) ? <Marker key={item.VehicleId} data={item} lat={item.Lat} lng={item.Lon} text={item.Line} onClick={handleMarkerClick(item)} /> : null)}
        </GoogleMapReact>
      </div>
      <Dialog onClose={() => {dispatch(resetMarker())}} open={!!marker && !!popup.current}>
        {popup.current}
      </Dialog>
    </React.Fragment>
  );
};

export default Map;