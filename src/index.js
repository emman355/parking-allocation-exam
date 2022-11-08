import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FormContextProvider } from './context/Form-context';
import { ParkingLotProvider } from './context/ParkingLotContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FormContextProvider>
      <ParkingLotProvider>
        <App />
      </ParkingLotProvider>
    </FormContextProvider>
  </React.StrictMode>
);
