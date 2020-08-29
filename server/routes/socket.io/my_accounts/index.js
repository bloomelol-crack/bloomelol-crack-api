const { account } = require('../../../database/models');
const { getAccountPrice } = require('../../../utils/account');

const constants = require('./constants');
/**
 * @param {import('socket.io').Socket} socket
 */
const define = socket => {
  socket.on(constants.receive.GET_MY_ACCOUNTS, async userId => {
    const Accounts = await account.get({ UserID: userId }, { sort: { Level: -1 } });
    if (!Accounts) return socket.emit(constants.emit.GET_MY_ACCOUNTS_FAILURE);
    socket.emit(constants.emit.GET_MY_ACCOUNTS_SUCCESS, Accounts);
  });
};

module.exports = { define };
