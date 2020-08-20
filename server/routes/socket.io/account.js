const { account } = require('../../database/models');

const constants = require('./constants/account');
/**
 * @param {import('socket.io').Socket} socket
 */
const define = socket => {
  socket.on(constants.receive.GET_ACCOUNTS, async (page = 1, rowsByPage = 25) => {
    const Accounts = await account.get();
    if (!Accounts) return socket.emit(constants.emit.GET_ACCOUNTS_FAILURE);
    socket.emit(constants.emit.GET_ACCOUNTS_SUCCESS, Accounts);
  });
};

module.exports = { define };
