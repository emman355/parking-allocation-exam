import React, { useState, useContext } from 'react';
import ParkingSlot from '../components/ParkingSlot';
import './ParkingLot.css';
import {
  FIXED_CHARGE,
  FULL_DAY_CHARGE,
  L_HOURLY_CHARGE,
  M_HOURLY_CHARGE,
  S_HOURLY_CHARGE,
} from '../utils/constants';
import { FormContext } from '../context/Form-context';
import { ParkingLotContext } from '../context/ParkingLotContext';
import { getVehicleValue } from '../utils/common';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ParkingLot = () => {
  const { carDetails } = useContext(FormContext);
  const { parkingArea, park, unpark } = useContext(ParkingLotContext);

  const [parkingSlot, setParkingSlot] = useState([]);
  const [currentSlot, setCurrentSlot] = useState({});
  const [hasParked, setHasParked] = useState(false);
  const [hasUnparked, setHasUnparked] = useState(false);
  const [totalCharge, setTotalCharge] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setParkingSlot(parkingArea);
  }, [parkingArea]);

  const handlePark = () => {
    let updatedParkSlot = park(
      parkingSlot,
      carDetails.carSize,
      carDetails.entrance
    );
    let slot = {
      row: updatedParkSlot.row,
      col: updatedParkSlot.col,
    };

    //Check if there is available slot
    if (updatedParkSlot) {
      //Toggle the hasParked state
      setHasParked(true);
      //Set the slot where car is parked
      setCurrentSlot(slot);
      //Update the slots
      handleUpdateSlots(updatedParkSlot);
    } else {
      setMessage('No parking slot available.');
      setHasUnparked(true);
    }
  };

  const handleUpdateSlots = updatedSlot => {
    //Update slot from the parkingSlots state
    setParkingSlot(prevState =>
      prevState.map((row, index) => {
        if (index === updatedSlot.row) {
          return row.map((col, index) => {
            if (index === updatedSlot.col) {
              return updatedSlot;
            } else {
              return col;
            }
          });
        } else {
          return row;
        }
      })
    );
  };
  const handleComputeCharges = () => {
    let remainingHours = carDetails.noOfHours;
    let size = getVehicleValue(carDetails.carSize);
    let charges = 0;
    let hourlyCharge = 0;

    //Set the hourly charge for each car size
    if (0 === size) {
      hourlyCharge = S_HOURLY_CHARGE;
    } else if (1 === size) {
      hourlyCharge = M_HOURLY_CHARGE;
    } else if (2 === size) {
      hourlyCharge = L_HOURLY_CHARGE;
    }

    // Check if no of hours exceed or equal to 24
    if (remainingHours >= 24) {
      remainingHours -= 24;
      //Add the full day and fixed charge
      charges += remainingHours * hourlyCharge + FULL_DAY_CHARGE + FIXED_CHARGE;
      setTotalCharge(charges);
      return;
    }

    // First 3 hours has a flat rate of 40
    charges += FIXED_CHARGE;
    remainingHours -= 3;

    //Computation for exceeding hourly rate
    if (remainingHours > 0) {
      charges += remainingHours * hourlyCharge;
    }

    setTotalCharge(charges);
  };
  const handleUnpark = () => {
    setHasParked(false);
    setHasUnparked(true);

    let resetSlot = unpark(parkingSlot, currentSlot.row, currentSlot.col);

    //Update the parking slots state
    handleUpdateSlots(resetSlot);

    //Check the total charges
    handleComputeCharges();
  };
  const handleRedirect = () => {
    navigate('/');
  };
  return (
    <div className="parking-lot-container">
      <div className="car-details">
        <h2>Parking Details</h2>
        <p>
          Car Size: <strong>{carDetails.carSize}</strong>
        </p>
        <p>
          Hours of Parking: <strong>{carDetails.noOfHours}</strong>
        </p>
        <p>
          Entrance: <strong>{carDetails.entrance}</strong>
        </p>
        <div className="car-functions">
          {!hasParked && !hasUnparked && (
            <button onClick={handlePark}>Park Car</button>
          )}
          {hasParked && !hasUnparked && (
            <button onClick={handleUnpark}>Unpark Car</button>
          )}
          {message && (
            <span className="message">
              <strong>{message}</strong>
            </span>
          )}
          {hasUnparked && (
            <div>
              <h2>Parking Details</h2>
              <p>
                Total Parking Charge: ₱<strong>{totalCharge}</strong>
              </p>
              <div className="car-functions">
                <button onClick={handleRedirect}>Park another car</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="parking-details">
        <h3>Parking Lot</h3>
        <div className="legend">
          <div className="legend-container">
            <span className="legend-occupied"></span> <h5>Occupied</h5>
          </div>
          <div className="legend-container">
            <span className="legend-vacant"></span> <h5>Vacant</h5>
          </div>
          <div className="legend-container">
            <span className="legend-entrance"></span> <h5>Entrance</h5>
          </div>
        </div>
        <section className="main">
          {parkingSlot.map((row, index) => (
            <div key={index}>
              <ParkingSlot slot={row} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ParkingLot;
