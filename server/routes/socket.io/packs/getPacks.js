const { getPackAccountFilter } = require('../../../utils/packs');
const { account } = require('../../../database/models');
const { PACKS } = require('../../actions/paypal/constants');
const { socketIo } = require('../../../utils/middlewares');
const { REGIONS } = require('../../../constants');

const { receive, emit, broadcast } = require('./constants');

const packNames = Object.keys(PACKS);

const getPack = async (name, region) => {
  const pack = PACKS[name];

  const availableAccounts = await account.count(getPackAccountFilter(pack, region));
  pack.stock = Math.floor(availableAccounts / pack.count);
  if (availableAccounts === null) return null;
  return pack;
};

/**
 * @param {import('socket.io').Socket} socket */
const defineGetPacks = socket => {
  socket.on(receive.GET_PACKS, async region => {
    let packs = await Promise.all(packNames.map(pack => getPack(pack, region)));
    packs = packs.filter(pack => pack && pack.stock);
    socket.emit(emit.GET_PACKS_SUCCESS, packs, region);
  });
};

const broadcastGetPacks = async () => {
  REGIONS.forEach(async region => {
    let packs = await Promise.all(packNames.map(pack => getPack(pack, region)));
    packs = packs.filter(pack => pack && pack.stock);
    socketIo.emit(broadcast.PACKS_UPDATED, packs, region);
  });
};

exports.defineGetPacks = defineGetPacks;
exports.broadcastGetPacks = broadcastGetPacks;
