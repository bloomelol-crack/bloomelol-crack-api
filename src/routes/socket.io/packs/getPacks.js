import { PACKS } from '../../../constants';
import { REGIONS } from '../../../constants';

import { receive, emit, broadcast } from './constants';

const packNames = Object.keys(PACKS);

const getPack = async (name, region) => {
  const pack = PACKS[name];

  const availableAccounts = await Account.count(packs.getPackAccountFilter(pack, region));
  pack.stock = Math.floor(availableAccounts / pack.count);
  if (availableAccounts === null) return null;
  return pack;
};

/**
 * @param {import('socket.io').Socket} socket */
export const defineGetPacks = socket => {
  socket.on(receive.GET_PACKS, async (region, type) => {
    let packs = await Promise.all(packNames.map(pack => getPack(pack, region)));
    packs = packs.filter(pack => pack && pack.stock && pack.type === type);
    socket.emit(emit.GET_PACKS_SUCCESS, packs, region);
  });
};

export const broadcastGetPacks = async () => {
  REGIONS.forEach(async region => {
    let packs = await Promise.all(packNames.map(pack => getPack(pack, region)));
    packs = packs.filter(pack => pack && pack.stock);
    socketIo.emit(broadcast.PACKS_UPDATED, packs, region);
  });
};
