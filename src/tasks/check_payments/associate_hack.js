export const associateHack = async payment => {
  const usersUpdated = await User.update(
    { 'Hacks.PaymentID': payment._id },
    { $set: { 'Hacks.$.Enabled': true } }
  );
  if (!usersUpdated) {
    rollbar.critical(`After Payment: Could not update user with payment ${payment._id}`);
    return;
  }
  rollbar.info(`${usersUpdated} users purchased a hack with Payment ${payment._id} ($${payment.Amount} USD)`);
};
