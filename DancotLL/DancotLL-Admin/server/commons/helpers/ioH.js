const io = require('socket.io');

const { httpServer } = require('../middlewares');

module.exports = io(httpServer);
