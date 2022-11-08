const FormReducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER':
      return {
        ...state,
        carSize: action.payload.carSize,
        noOfHours: Math.round(action.payload.noOfHours),
        entrance: action.payload.entrance,
      };
    default:
      return state;
  }
};

export default FormReducer;
