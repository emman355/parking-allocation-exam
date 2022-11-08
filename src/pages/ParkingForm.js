import React, { useState, useContext } from 'react';
import './ParkingForm.css';
import { CAR_SIZES, MALL_ENTRANCE } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { FormContext } from '../context/Form-context';

const ParkingForm = () => {
  const { register } = useContext(FormContext);
  const [carRegister, setCarRegister] = useState({
    carSize: '',
    noOfHours: '',
    entrance: '',
  });
  const navigate = useNavigate();

  const onChangeHandler = e => {
    const { name, value } = e.target;
    setCarRegister(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    register(carRegister);
    setCarRegister(prevState => ({
      ...prevState,
      carSize: '',
      noOfHours: '',
      entrance: '',
    }));
    navigate('/parking_lot');
  };

  return (
    <div className="container">
      <h2>Car Park Registration</h2>
      <form onSubmit={onSubmitHandler}>
        <div className="form-control">
          <label htmlFor="carsize">Car Size</label>
          <select
            value={carRegister.carSize}
            name="carSize"
            onChange={onChangeHandler}
          >
            <option value="selected" hidden="hidden">
              Choose Car Size
            </option>
            {CAR_SIZES.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="hours">Hours</label>
          <input
            value={carRegister.noOfHours}
            name="noOfHours"
            onChange={onChangeHandler}
            type="number"
            placeholder="Enter no of hours"
          />
        </div>
        <div className="form-control">
          <label htmlFor="entrance">Entrance</label>
          <select
            value={carRegister.entrance}
            name="entrance"
            onChange={onChangeHandler}
          >
            <option value="selected" hidden="hidden">
              Choose Entrance
            </option>
            {MALL_ENTRANCE.map((entrance, index) => (
              <option key={index} value={entrance}>
                {entrance}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn">
          Submit Details
        </button>
      </form>
    </div>
  );
};

export default ParkingForm;
