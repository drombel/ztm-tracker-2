import React, { useState } from 'react';
import './homepage.css';
import Map from './../../components/map/map';
import { useSelector, useDispatch } from 'react-redux';
import SettingsPopup from './SettingsPopup';
import FiltersPopup from './FiltersPopup';
import BusesPopup from './BusesPopup';

import { DialogTitle, Dialog, Drawer, List, DialogActions, DialogContent, Button, AppBar, Box, Toolbar, Typography, IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, DirectionsBus as BusIcon, Settings as SettingsIcon, Filter as FilterIcon } from '@mui/icons-material';

function Homepage () {
  const [drawerState, setDrawerState] = useState(false);
  const [settingsState, setSettingsState] = useState(false);
  const [filtersState, setFiltersState] = useState(false);
  const [busesState, setBusesState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerState(open);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="sticky">
            <Toolbar>
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>ZTM tracker 2</Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Drawer
            anchor='left'
            open={drawerState}
            onClose={toggleDrawer(false)}
          >
          <Box
            sx={{ width: 250 }} role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem button onClick={() => setBusesState(true)}><ListItemIcon><BusIcon /></ListItemIcon><ListItemText primary={'Autobusy i tramwaje'} /></ListItem>
              <ListItem button onClick={() => setSettingsState(true)}><ListItemIcon><SettingsIcon /></ListItemIcon><ListItemText primary={'Ustawienia'} /></ListItem>
              <ListItem button onClick={() => setFiltersState(true)}><ListItemIcon><FilterIcon /></ListItemIcon><ListItemText primary={'Filtry'} /></ListItem>
            </List>
          </Box>
        </Drawer>
      </header>
      <Box sx={{ flex: '1 0 0', display: 'flex' }}>
        <Map />
      </Box>

      <SettingsPopup popupState={settingsState} setPopupState={setSettingsState} />
      <FiltersPopup popupState={filtersState} setPopupState={setFiltersState} />
      <BusesPopup popupState={busesState} setPopupState={setBusesState} />
      
    </Box>
  );
}

export default Homepage;