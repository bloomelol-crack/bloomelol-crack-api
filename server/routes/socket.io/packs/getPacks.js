const { getPackAccountFilter } = require('../../../utils/packs');
const { account } = require('../../../database/models');
const { PACKS } = require('../../actions/paypal/constants');
const { socketIo } = require('../../../utils/middlewares');

const { receive, emit, broadcast } = require('./constants');

const packNames = Object.keys(PACKS);

const getPack = async name => {
  const pack = PACKS[name];

  const availableAccounts = await account.count(getPackAccountFilter(pack));
  pack.stock = Math.floor(availableAccounts / pack.count);
  if (availableAccounts === null) return null;
  return pack;
};

/**
 * @param {import('socket.io').Socket} socket */
const defineGetPacks = socket => {
  socket.on(receive.GET_PACKS, async () => {
    let packs = await Promise.all(packNames.map(getPack));
    packs = packs.filter(pack => pack && pack.stock);
    if (packs.length) socket.emit(emit.GET_PACKS_SUCCESS, packs);
  });
};

const broadcastGetPacks = async () => {
  let packs = await Promise.all(packNames.map(getPack));
  packs = packs.filter(pack => pack && pack.stock);
  if (packs.length) socketIo.emit(broadcast.PACKS_UPDATED, packs);
};

exports.defineGetPacks = defineGetPacks;
exports.broadcastGetPacks = broadcastGetPacks;
