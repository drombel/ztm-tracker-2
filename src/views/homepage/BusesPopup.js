import { useSelector, useDispatch } from 'react-redux';
import { setMarker } from '../../reducers/marker/markerReducer';
import { setOptions } from '../../reducers/settings/settingsReducer';
import { useRef, useState } from 'react';

import { DialogTitle, Dialog, DialogActions, DialogContent, Button,  Paper, TableContainer, Table, TableRow, TableCell, TableBody, FormControl, InputLabel, Input, IconButton, } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

export default function (props) {
  const { popupState = false, setPopupState = () => null } = props;
  const [line, setLine] = useState('');
  const buses = useSelector(store => store.buses);
  const routes = useSelector(store => store.routes);
  const preparedBuses = useRef([]);
  const dispatch = useDispatch();
  const handleClose = () => setPopupState(false);

  preparedBuses.current = buses.map(bus => {
    let newBus = {...bus};
    const route = routes.find(route => route.tripId === parseInt(bus.Route) && route.routeId === parseInt(bus.Line));
    newBus['tripHeadsign'] = route?.tripHeadsign || 'Brak docelowego przystanku';
    return newBus;
  });

  const formattedText = (line || '(.)*').trim().replace(' ', ').*(');
  const re = new RegExp(`.*(${formattedText})+.*`,"gi");
  const filteredBuses = (!!line ? preparedBuses.current.filter(item => re.test(item.Line) || re.test(item.tripHeadsign) ) : preparedBuses.current);

  const setBus = (item) => {
    dispatch(setOptions({center: { lat: item.Lat, lng: item.Lon }}));
    dispatch(setMarker(item));
    setPopupState(false);
  };

  return (
    <Dialog onClose={handleClose} open={!!popupState}>
      <DialogTitle sx={{ textAlign: 'center' }}>Autobusy i tramwaje</DialogTitle>
      <DialogContent sx={{ height: '80vh', maxHeight: 600, }}>
        <FormControl variant="standard" fullWidth sx={{ marginBottom: 20 }}>
          <InputLabel htmlFor="component-simple">Linia lub trasa</InputLabel>
          <Input value={line} onChange={e => setLine(e.target.value)} 
            sx={{ width: 500, maxWidth: '100%', }}
            endAdornment={<IconButton onClick={() => setLine('')}><ClearIcon /></IconButton>}
          />
        </FormControl>
        <TableContainer component={Paper}>
          <Table aria-label="Lista autobusów">
            <TableBody>
              {filteredBuses.map((item) => (
                <TableRow key={item.VehicleId} onClick={() => setBus(item)} sx={{cursor: 'pointer'}} hover>
                  <TableCell>{item.tripHeadsign}</TableCell>
                  <TableCell align="right">{item.Line}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Zamknij</Button>
      </DialogActions> 
    </Dialog>
  );
}