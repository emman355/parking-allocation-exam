import React from 'react';

const ParkingSlot = ({ slot }) => {
  return (
    <>
      {slot.map((item, index) => (
        <div
          key={index}
          className={
            null === item
              ? 'slot'
              : item.isOccupied
              ? 'slot-occupied'
              : item.isEntrance
              ? 'slot-entrance'
              : 'slot-vacant'
          }
        >
          {item && item.slotSize && <h3>{item.slotSize.desc}</h3>}
          {item && item.entrance && <h3>{item.entrance}</h3>}
        </div>
      ))}
    </>
  );
};

export default ParkingSlot;
