import React from 'react';
import Homepage from './views/homepage/homepage';
import './app.css';
import store from './reducers/store'
import { Provider } from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <Homepage />
    </Provider>
  );
}

export default App;
