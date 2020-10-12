import { SOCKET_EVENTS } from '../../constants';

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
  users.forEach(user => {
    socketIo.to(user._id).emit(SOCKET_EVENTS.emit.USER_UPDATED, user);
  });
};
