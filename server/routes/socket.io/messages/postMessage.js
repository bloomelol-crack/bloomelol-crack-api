const { message } = require('../../../database/models');
const { socketIo } = require('../../../utils/middlewares');

const { emit, receive, broadcast } = require('./constants');

const definePostMessage = socket => {
  socket.on(receive.POST_MESSAGE, async ({ user, messageUid, text }) => {
    if (!user || !text) return socket.emit(emit.GET_MESSAGES_FAILURE);
    socket.emit(emit.MESSAGE_SENT, messageUid);
    const newMessage = {
      UserID: user._id,
      UserName: user.Name,
      UserSurname: user.Surname,
      Text: text,
      Status: 'Sent',
      createdAt: Date.now()
    };
    const saved = await message.save(newMessage);
    if (!saved) return socket.emit(emit.MESSAGE_SEND_ERROR, messageUid);

    socketIo.emit(broadcast.MESSAGE_CREATED, newMessage);
  });
};

exports.definePostMessage = definePostMessage;
