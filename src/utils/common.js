export const getVehicleValue = size => {
  switch (size) {
    case 'S':
      return 0;
    case 'M':
      return 1;
    case 'L':
      return 2;
    default:
      return '';
  }
};
