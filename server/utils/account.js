// TODO remove / 4
const getAccountPrice = account => +(9.5 + (account.Level - 30) / 5).toFixed(2) / 4;

module.exports = { getAccountPrice };
