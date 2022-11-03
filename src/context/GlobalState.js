import React, { createContext, useReducer } from 'react';
import Appreducer from './AppReducer';

//inital State
const initialState = {
  carSize: '',
  noOfHours: null,
  entrance: '',
  slot: null,
};

//Create context
export const GlobalContext = createContext(initialState);

//Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Appreducer, initialState);
  //Actions
  const reset = () => {
    dispatch({
      type: 'RESET',
    });
  };
  const register = carRegister => {
    dispatch({
      type: 'REGISTER',
      payload: carRegister,
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        carDetails: state,
        reset,
        register,
        // parkCar,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
