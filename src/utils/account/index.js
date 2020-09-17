const { ELO_PRICES } = require('./constants');

const priceReference = 5;
const levelReference = 30;
const amountByLevel = 0.015;

const getAccountPrice = account =>
  +(
    priceReference +
    (account.Level - levelReference) * amountByLevel +
    (ELO_PRICES[account.Elo] || 0)
  ).toFixed(2);

module.exports = { getAccountPrice };
