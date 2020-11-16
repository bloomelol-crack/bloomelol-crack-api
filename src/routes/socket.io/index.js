import './types';

const allAccounts = require('./all_accounts');
const myAccounts = require('./my_accounts');
const packs = require('./packs');
const openHack = require('./open_hack');
const messages = require('./messages');
const logins = require('./logins');
const { USER_SOCKETS_KEY, receive, emit } = require('./constants/connection');

socketIo.sockets.on(
  'connect',
  /** @param {CustomSocket} socket */
  socket => {
    socket.openHacks = [];

    socket.emit(emit.WHO_ARE_YOU);
    socket.on(receive.I_AM_X, async userId => {
      socket.userId = userId;
      log('socket.userId', socket.userId);
    });
    allAccounts.define(socket);
    myAccounts.define(socket);
    packs.define(socket);
    openHack.define(socket);
    messages.define(socket);
    logins.define(socket);
  }
);

redis.Delete(USER_SOCKETS_KEY, {});
