import constants from './constants';
import { getUserSockets } from '../utils';

/** @param {CustomSocket} socket */
export const define = socket => {
  socket.on(
    constants.receive.OPEN_HACK,
    /** @param {OpenHackParams} params @param {Function} cb  */
    async (params, cb) => {
      const socketsUsingHack = getUserSockets(params.userId, userSocket =>
        userSocket.openHacks.includes(params.hackCode)
      );
      if (!socketsUsingHack.length) return cb({ allowed: true });
      const user = await User.get({ _id: params.userId });
      if (!user || !user.length) {
        logError(`Failed to get user ${params.userId} when opening hack`);
        return cb({ allowed: true });
      }
      const hack = user.Hacks.filter(({ Code }) => Code === params.hackCode);
      if (!hack) {
        logError(`User ${formatUser(user)} tried to execute inexistent hack: ${params.hackCode}`);
        return cb({ allowed: true });
      }
      cb({ allowed: !hack.AllowedSessions || hack.AllowedSessions > socketsUsingHack.length });
    }
  );
};
