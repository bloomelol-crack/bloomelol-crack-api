const getAccountPrice = account => +(9.5 + (account.Level - 30) / 5).toFixed(2);

module.exports = { getAccountPrice };
