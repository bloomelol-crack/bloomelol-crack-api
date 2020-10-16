const { ELO_PRICES } = require('./constants');

const priceReference = 5;
const levelReference = 30;
const amountByLevel = 0.015;

const getAccountPrice = account =>
  +(
    priceReference +
    (account.LOL.Level - levelReference) * amountByLevel +
    (ELO_PRICES[account.LOL.Elo] || 0)
  ).toFixed(2);

globalThis.accountUtils = { getAccountPrice };
