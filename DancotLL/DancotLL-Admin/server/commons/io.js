const io = require('./helpers/ioH');

const users = {};

io.on('connection', socket => {
  let globalUserId = '';
  socket.emit('ConnectedIO');
  socket.on('WhoAmI', userId => {
    users[userId] = socket;
    globalUserId = userId;
  });

  socket.on('disconnect', () => users[globalUserId] && delete users[globalUserId]);
});

module.exports = {
  emit: (userId, event, message) => users[userId] && users[userId].emit(event, message),
  broadcast: (event, message) => io.sockets.emit(event, message),
  isUserConnected: userId => !!users[userId]
};
