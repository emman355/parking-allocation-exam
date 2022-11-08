import React, { createContext, useReducer } from 'react';
import FormReducer from './FormReducer';

//inital State
const initialState = {
  carSize: '',
  noOfHours: null,
  entrance: '',
  slot: null,
};

//Create context
export const FormContext = createContext({
  carDetails: {},
  register: () => {},
});

//Provider component
export const FormContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FormReducer, initialState);
  //Actions
  const register = carInput => {
    dispatch({
      type: 'REGISTER',
      payload: carInput,
    });
  };

  return (
    <FormContext.Provider
      value={{
        carDetails: state,
        register,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
