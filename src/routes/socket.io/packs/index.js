import { defineGetPacks, broadcastGetPacks } from './getPacks';
/**
 * @param {import('socket.io').Socket} socket */
const define = socket => {
  defineGetPacks(socket);
};

export { define, broadcastGetPacks };
