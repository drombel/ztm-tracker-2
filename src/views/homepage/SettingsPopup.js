import { useSelector, useDispatch } from 'react-redux';
import { setRefresh, resetOptions } from '../../reducers/settings/settingsReducer';

import { DialogTitle, Dialog, DialogActions, DialogContent, Button, FormControl, FormGroup, FormControlLabel, Switch, } from '@mui/material';

export default function (props) {
  const { popupState = false, setPopupState = () => null } = props;
  const settings = useSelector(store => store.settings);
  const dispatch = useDispatch();
  const handleRefreshToggle = () => {
    dispatch(setRefresh(!settings.options.refresh));
  }
  const handleResetSettings = () => {
    dispatch(resetOptions());
  };

  const handleClose = () => setPopupState(false);

  return (
    <Dialog onClose={handleClose} open={!!popupState}>
      <DialogTitle sx={{ textAlign: 'center' }}>Ustawienia</DialogTitle>
      <DialogContent>
      <FormControl variant="standard" fullWidth sx={{ marginBottom: 20 }}>
          <FormGroup>
            <FormControlLabel control={<Switch checked={settings.options.refresh} onClick={handleRefreshToggle} />} label="Odświeżanie w tle" />
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleResetSettings}>Resetuj</Button>
        <Button onClick={handleClose}>Zamknij</Button>
      </DialogActions> 
    </Dialog>
  );
}