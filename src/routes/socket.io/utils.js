/** @callback Comparator @param {CustomSocket} socket @returns {boolean} */

/** @param {string} userId @param {Comparator} comparator */
export const getUserSockets = (userId, comparator) => {
  /** @type {import('socket.io').Socket[]} */
  const userSockets = [];
  const { sockets } = middlewares.socketIo.sockets;
  const userSocketKeys = Object.keys(sockets).filter(
    key =>
      console.log('sockets[key].userId', sockets[key].userId) ||
      (sockets[key].userId === userId && (!comparator || comparator(sockets[key])))
  );
  userSocketKeys.forEach(key => userSockets.push(sockets[key]));
  return userSockets;
};
