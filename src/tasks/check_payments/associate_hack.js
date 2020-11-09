import { SOCKET_EVENTS } from '../../constants';
import { getUserSockets } from '../../routes/socket.io/utils';

export const associateHack = async payment => {
  const usersUpdated = await User.update(
    { 'Hacks.PaymentID': payment._id },
    { $set: { 'Hacks.$.Enabled': true } }
  );
  if (!usersUpdated)
    return rollbar.critical(`After Payment: Could not update user with payment ${payment._id}`);

  rollbar.info(`${usersUpdated} users purchased a hack with Payment ${payment._id} ($${payment.Amount} USD)`);

  const users = await User.get({ 'Hacks.PaymentID': payment._id });
  if (!users)
    logError(`Could not get user after payment for sending update event, payment id: ${payment._id}`);
  log('users.length', users.length);
  users.forEach(user => {
    const userSockets = getUserSockets(user._id);
    log('userSockets.length', userSockets.length);
    userSockets.forEach(userSocket => {
      userSocket.emit(SOCKET_EVENTS.emit.USER_UPDATED, user);
    });
  });
};
