const { getLevelFilter } = require('../../../utils/packs');
const { account } = require('../../../database/models');
const { PACKS } = require('../../actions/paypal/constants');

const { receive, emit, broadcast } = require('./constants');

/**
 * @param {import('socket.io').Socket} socket */
module.exports = socket => {
  socket.on(receive.GET_PACKS, () => {
    const names = Object.keys(PACKS);
    names.forEach(async name => {
      const pack = PACKS[name];
      const levelFilter = getLevelFilter(pack);

      const availableAccounts = await account.count({ Level: levelFilter });
      if (availableAccounts === null) return socket.emit(emit.GET_PACK_FAILURE);
      pack.stock = Math.floor(availableAccounts / pack.count);
      if (pack.stock > 0) socket.emit(emit.GET_PACK_SUCCESS, pack);
    });
  });
};
