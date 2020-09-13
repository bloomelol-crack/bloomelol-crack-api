const { message } = require('../../../database/models');

const { receive, broadcast } = require('./constants');

/**
 * @param {import('socket.io').Socket} socket */
const defineEmitReceivedMessage = socket => {
  socket.on(receive.MESSAGE_RECEIVED, async messageUids => {
    if (!messageUids || !messageUids.length) return;
    socket.broadcast.emit(broadcast.MESSAGE_RECEIVED, messageUids);
    message.update({ Uid: { $in: messageUids } }, { $set: { Status: 'Received' } });
  });
};

exports.defineEmitReceivedMessage = defineEmitReceivedMessage;
