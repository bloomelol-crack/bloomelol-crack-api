const moment = require('moment');

const constants = require('./constants');
/**
 * @param {import('socket.io').Socket} socket
 */
const define = socket => {
  socket.on(constants.receive.GET_ACCOUNTS, async () => {
    const accounts = await Account.get(
      {
        EmailVerified: false,
        NewPassword: { $exists: true },
        'LOL.Region': { $exists: true },
        'LOL.BlueEssence': { $exists: true },
        UserID: { $exists: false },
        PaymentID: { $exists: false },
        $or: [{ 'LOL.LastPlay': { $type: 10 } }, { createdAt: { $lte: moment().subtract(7, 'days') } }]
      },
      { sort: { 'LOL.Level': -1 }, projection: { UserName: 0, Password: 0, NewPassword: 0 } }
    );
    if (!accounts) return socket.emit(constants.emit.GET_ACCOUNTS_FAILURE);
    accounts.forEach(account => (account.Price = accountUtils.getAccountPrice(account)));
    socket.emit(constants.emit.GET_ACCOUNTS_SUCCESS, accounts);
  });
};

module.exports = { define };
