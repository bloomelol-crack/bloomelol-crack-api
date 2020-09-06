const { socketIo } = require('../../utils/middlewares');
const env = require('../../../env.json');
const redis = require('../../utils/redis');

const allAccounts = require('./all_accounts');
const myAccounts = require('./my_accounts');
const packs = require('./packs');
const { USER_SOCKETS_KEY, receive, emit } = require('./constants/connection');

socketIo.sockets.on('connect', socket => {
  let userId;

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
  packs.define(socket);
});

redis.Delete(USER_SOCKETS_KEY, {});

module.exports = { socketIo };
