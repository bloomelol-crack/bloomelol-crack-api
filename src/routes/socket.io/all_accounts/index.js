const moment = require('moment');

const { account } = require('../../../database/models');
const { getAccountPrice } = require('../../../utils/account');

const constants = require('./constants');
/**
 * @param {import('socket.io').Socket} socket
 */
const define = socket => {
  socket.on(constants.receive.GET_ACCOUNTS, async () => {
    const Accounts = await account.get(
      {
        EmailVerified: false,
        NewPassword: { $exists: true },
        Region: { $exists: true },
        UserID: { $exists: false },
        PaypalPaymentID: { $exists: false },
        $or: [{ LastPlay: { $type: 10 } }, { createdAt: { $lte: moment().subtract(7, 'days') } }]
      },
      { sort: { Level: -1 }, UserName: 0, Password: 0, NewPassword: 0 }
    );
    if (!Accounts) return socket.emit(constants.emit.GET_ACCOUNTS_FAILURE);
    Accounts.forEach(Account => (Account.Price = getAccountPrice(Account)));
    socket.emit(constants.emit.GET_ACCOUNTS_SUCCESS, Accounts);
  });
};

module.exports = { define };
