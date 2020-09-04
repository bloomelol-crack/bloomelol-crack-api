const priceReference = 5;
const levelReference = 30;
const amountByLevel = 0.015;

const getAccountPrice = account =>
  +(priceReference + (account.Level - levelReference) * amountByLevel).toFixed(2);

module.exports = { getAccountPrice };
