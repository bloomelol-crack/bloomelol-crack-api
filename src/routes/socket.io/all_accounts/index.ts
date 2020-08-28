import db from 'database';
import { getAccountPrice } from 'utils/account';
import * as constants from 'routes/socket.io/all_accounts/constants';

export const define = (socket: import('socket.io').Socket) => {
  socket.on(
    constants.receive.GET_ACCOUNTS,
    async (): Promise<void> => {
      const Accounts = await db.account?.get(
        {
          NewPassword: { $exists: true },
          UserID: { $exists: false },
          PaypalPaymentID: { $exists: false }
        },
        { sort: { Level: -1 } }
      );
      if (!Accounts) return void socket.emit(constants.emit.GET_ACCOUNTS_FAILURE);
      Accounts.forEach(Account => (Account.Price = getAccountPrice(Account)));
      socket.emit(constants.emit.GET_ACCOUNTS_SUCCESS, Accounts);
    }
  );
};
