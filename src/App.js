import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ParkingForm from './pages/ParkingForm';
import ParkingLot from './pages/ParkingLot';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ParkingForm />} />
        <Route path="/parking_lot" element={<ParkingLot />} />
      </Routes>
    </Router>
  );
};

export default App;
