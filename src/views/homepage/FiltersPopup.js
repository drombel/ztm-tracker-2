import { DialogTitle, Dialog, DialogActions, DialogContent, Button, TextField, FormControl, Stack, InputLabel, Select, MenuItem, Autocomplete } from '@mui/material';
import { setFilters, resetFilters } from '../../reducers/settings/settingsReducer';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/system';

export default function (props) {
  const { popupState = false, setPopupState = () => null } = props;
  const filters = useSelector(store => store.settings.filters);
  const buses = useSelector(store => store.buses);
  const routes = useSelector(store => store.routes);
  const dispatch = useDispatch();

  // todo: zmienić preparedBuses jak są prepared routes
  const preparedBuses = [...new Set(buses.filter(item => !!item.Line).map(item => item.Line))].sort().map(item => ({ label: item }));
  const preparedRoutes = routes
    .filter((item, i, unique) => (!!item.tripHeadsign && i === unique.findIndex((t) => (t.tripHeadsign === item.tripHeadsign))))
    .sort((a, b) => a.tripHeadsign.localeCompare(b.tripHeadsign))
    .map(item => ({ label: item.tripHeadsign, id: item.id, key: item.id, routeId: item.routeId, tripId: item.tripId }));
  
  // todo: add delay to avoid flooding redux with requests
  const handleClose = () => setPopupState(false);
  const handleReset = () => dispatch(resetFilters());
  const handleSpeed = e => dispatch(setFilters({ speed: e.target.value }));
  const handleDelay = e => dispatch(setFilters({ delay: e.target.value }));
  const handleRouteStop = (e, value) => dispatch(setFilters({ route_stop: value }));
  const handleLine = (e, value) => dispatch(setFilters({ line: value }));

  return (
    <Dialog onClose={handleClose} open={!!popupState}>
      <DialogTitle sx={{ textAlign: 'center' }}>Filtry nałożone na mapę</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{marginTop: 10, minHeight: 400}}>
          <FormControl variant="standard" fullWidth>
            <TextField label="Prędkość" type="number" onChange={handleSpeed} value={filters.speed} InputProps={{ inputProps: { min: 0, max: 200 } }} />
          </FormControl>
          <FormControl variant="standard" fullWidth>
            <TextField label="Przyśpieszenie składu w sekundach" type="text" onChange={handleDelay} value={filters.delay} />
          </FormControl>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal value={filters.route_stop} multiple
              options={preparedRoutes} onChange={handleRouteStop}
              sx={{ width: 300 }} 
              renderInput={(params) => <TextField {...params} label="Przystanek docelowy" />}
            />
          </FormControl>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal value={filters.line} multiple
              options={preparedBuses} onChange={handleLine}
              sx={{ width: 300 }} 
              renderInput={(params) => <TextField {...params} label="Linia" />}
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>Resetuj</Button>
        <Button onClick={handleClose}>Zamknij</Button>
      </DialogActions> 
    </Dialog>
  );
}