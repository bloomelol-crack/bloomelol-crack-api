import { getPackAccountFilter } from '../../../utils/packs';
import { account } from '../../../database/models';
import { PACKS } from '../../actions/paypal/constants';
import { socketIo } from '../../../utils/middlewares';
import { REGIONS } from 'Constants';

import { receive, emit, broadcast } from './constants';

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
  socket.on(receive.GET_PACKS, async (region, type) => {
    let packs = await Promise.all(packNames.map(pack => getPack(pack, region)));
    packs = packs.filter(pack => pack && pack.stock && pack.type === type);
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
