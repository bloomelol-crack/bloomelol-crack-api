export const getLicencePrice = (licence, sessions) =>
  +(licence.price + licence.price * licence.sessionCoef * (sessions - 1)).toFixed(2);
