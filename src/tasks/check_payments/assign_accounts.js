import { broadcastGetPacks } from '../../routes/socket.io/packs';
import { emit } from './constants';

export const assignAccounts = async payment => {
  const accounts = await Account.get({ PaymentID: payment._id });
  if (!accounts) {
    rollbar.critical(`After Payment: Could not find account with payment ${payment._id}`);
    return;
  }
  if (!accounts.length) {
    rollbar.critical(`After Payment: Didn't find account with payment ${payment._id}`);
    return;
  }
  const accountUpdated = await Account.update({ PaymentID: payment._id }, { UserID: payment.UserID });
  if (!accountUpdated) {
    rollbar.critical(`After Payment: Could not update account with payment ${payment._id}`);
    return;
  }
  rollbar.info(`Purchased ${accountUpdated} accounts with Payment ${payment._id} ($${payment.Amount} USD)`);

  accounts.forEach(Account => (Account.UserID = payment.UserID));
  socketIo.emit(emit.ACCOUNTS_PURCHASED, accounts);
  broadcastGetPacks();
};
