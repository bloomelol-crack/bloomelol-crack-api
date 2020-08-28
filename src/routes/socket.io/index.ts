const { socketIo: io } = require('../../utils/middlewares');
const redis = require('../../utils/redis');

const allAccounts = require('./all_accounts');
const myAccounts = require('./my_accounts');
const { USER_SOCKETS_KEY, receive, emit } = require('./constants/connection');

io.sockets.on('connect', (socket: import('socket.io').Socket) => {
  let userId: string;

  socket.emit(emit.WHO_ARE_YOU);
  socket.on(receive.I_AM_X, async _userId => {
    const added = await redis.Add(USER_SOCKETS_KEY, { userId: _userId, socketId: socket.id });
    if (added) userId = _userId;
  });
  socket.on('disconnect', () => {
    if (userId) redis.Delete(USER_SOCKETS_KEY, { socketId: socket.id });
  });
  allAccounts.define(socket);
  myAccounts.define(socket);
});

redis.Delete(USER_SOCKETS_KEY, {});

export const socketIo = io;
