import React, { useState, useEffect, useContext } from 'react';
import ParkingSlot from '../components/ParkingSlot';
import './ParkingLot.css';
import {
  PARKING_LOT_SIZES,
  FIXED_CHARGE,
  FULL_DAY_CHARGE,
  L_HOURLY_CHARGE,
  M_HOURLY_CHARGE,
  S_HOURLY_CHARGE,
} from '../utils/constants';
import { GlobalContext } from '../context/GlobalState';
import { getVehicleValue } from '../utils/common';
import { useNavigate } from 'react-router-dom';

var PARKING_SLOT = [];
let MAX_COLS = 5;
let MAX_ROWS = 5;
const ENTRANCE = [
  { name: 'A', row: 0, col: 2 },
  { name: 'B', row: 2, col: 0 },
  { name: 'C', row: 4, col: 2 },
];
PARKING_SLOT = new Array(MAX_ROWS)
  .fill(null)
  .map(() => new Array(MAX_COLS).fill(null));

const getRandomLotSize = () => {
  const min = 0;
  const max = 2;
  const lot_sizes = PARKING_LOT_SIZES;
  const size = Math.round(Math.random() * (max - min));
  const desc = lot_sizes[size];
  return {
    value: size,
    desc: desc,
  };
};

const isPathway = (row, col) => {
  if (col === 0 || row === 0 || row === MAX_ROWS - 1 || col === MAX_COLS - 1) {
    return true;
  } else {
    return false;
  }
};

//check if the row/column is an entrance
const isEntrance = (row, col) => {
  if (
    (ENTRANCE[0].row === row && ENTRANCE[0].col === col) ||
    (ENTRANCE[1].row === row && ENTRANCE[1].col === col) ||
    (ENTRANCE[2].row === row && ENTRANCE[2].col === col)
  ) {
    return true;
  } else {
    return false;
  }
};

const park = (parkingSlots, carSize, ent) => {
  let entrance = ENTRANCE.find(o => o.name === ent.toUpperCase());
  let size = getVehicleValue(carSize);

  //Value checking
  let newRow = -1,
    newCol = -1;

  let distance = 9999;

  // Search for the  parking space
  for (let row = 0; row < MAX_ROWS; row++) {
    for (let col = 0; col < MAX_COLS; col++) {
      if (!isPathway(row, col)) {
        let slot = parkingSlots[row][col];
        // Check if vehicle fits in parking slot
        if (size <= slot.slotSize.value && !slot.isOccupied) {
          let computedDistance =
            Math.abs(entrance.row - slot.row) +
            Math.abs(entrance.col - slot.col);
          if (distance > computedDistance) {
            distance = computedDistance;
            newRow = row;
            newCol = col;
          }
        }
      }
    }
  }

  //Check if there is an available slot
  if (newRow === -1) {
    return false;
  } else {
    Object.assign(parkingSlots[newRow][newCol], {
      isOccupied: true,
      vehicleSize: {
        value: parseInt(size),
        desc: carSize,
      },
      slotSize: parkingSlots[newRow][newCol].slotSize,
      row: newRow,
      col: newCol,
    });
    return parkingSlots[newRow][newCol];
  }
};

const unpark = (parkingSlots, row, col) => {
  let parking_slot = parkingSlots[row][col];

  Object.assign(parkingSlots[row][col], {
    isOccupied: false,
    vehicleSize: null,
    slotSize: parking_slot.slotSize,
    row,
    col,
  });

  return parkingSlots[row][col];
};

const ParkingLot = () => {
  const { carDetails } = useContext(GlobalContext);
  const [parkingSlot, setParkingSlot] = useState([]);
  const [currentSlot, setCurrentSlot] = useState({});
  const [hasParked, setHasParked] = useState(false);
  const [hasUnparked, setHasUnparked] = useState(false);
  const [totalCharge, setTotalCharge] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const initializeParkingSpaces = () => {
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        if (!isPathway(row, col)) {
          PARKING_SLOT[row][col] = {
            isOccupied: false,
            slotSize: getRandomLotSize(),
            row,
            col,
          };
        } else if (isEntrance(row, col)) {
          //set the entrance slots
          PARKING_SLOT[row][col] = {
            isEntrance: true,
            entrance: ENTRANCE.find(o => o.row === row && o.col === col).name,
          };
        }
      }
    }
    setParkingSlot(PARKING_SLOT);
  };

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
  useEffect(() => {
    initializeParkingSpaces();
  }, []);
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
