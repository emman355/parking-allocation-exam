const AppReducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return {
        ...state,
        carSize: '',
        noOfHours: '',
        entrance: '',
        slot: null,
      };
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

export default AppReducer;
