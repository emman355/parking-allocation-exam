import React, { createContext, useState } from 'react';
import { PARKING_LOT_SIZES } from '../utils/constants';
import { getVehicleValue } from '../utils/common';
import { useEffect } from 'react';

//inital State
var PARKING_SLOT = [];
let MAX_COLS = 5;
let MAX_ROWS = 5;
PARKING_SLOT = new Array(MAX_ROWS)
  .fill(null)
  .map(() => new Array(MAX_COLS).fill(null));

const ENTRANCE = [
  { name: 'A', row: 0, col: 2 },
  { name: 'B', row: 2, col: 0 },
  { name: 'C', row: 4, col: 2 },
];

//Create context
export const ParkingLotContext = createContext({
  parkingArea: [],
  park: () => {},
  unpark: () => {},
});

//Provider component
export const ParkingLotProvider = ({ children }) => {
  const [parkingSlot, setParkingSlot] = useState([]);
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
    if (
      col === 0 ||
      row === 0 ||
      row === MAX_ROWS - 1 ||
      col === MAX_COLS - 1
    ) {
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

  useEffect(() => {
    const initializeParkingSpaces = setTimeout(() => {
      console.log('Initialize Parking Spaces');
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
    }, 500);
    return () => {
      console.log('CLEANUP');
      clearTimeout(initializeParkingSpaces);
    };
  }, []);

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

  return (
    <ParkingLotContext.Provider
      value={{
        parkingArea: parkingSlot,
        park: park,
        unpark: unpark,
      }}
    >
      {children}
    </ParkingLotContext.Provider>
  );
};
