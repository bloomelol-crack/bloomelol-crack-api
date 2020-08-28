import { uuid } from 'uuidv4';
import db from 'database';

import { socketIo } from 'routes/socket.io';

import { broadcast } from 'routes/socket.io/all_accounts/constants';
import { getAccountPrice } from 'utils/account';

module.exports = {
  setCredentials: async (req: ExpressRequest, res: ExpressResponse): Promise<any> => {
    const Accounts = await db.account?.get(
      { EmailVerified: false, NewPassword: { $exists: false } },
      { sort: { Level: -1 } }
    );
    if (!Accounts) return res.status(500).json({ error: 'Problem finding accounts' });
    const [Account] = Accounts;
    if (!Account) return res.status(404).json({ error: 'Accounts not found for updating' });
    const { emails } = req.body;
    Account.NewPassword = uuid().replace(/-/g, '').toUpperCase() + uuid().replace(/-/g, '').substring(0, 5);
    Account.NewEmail = emails[Math.floor(Math.random() * emails.length)];
    Account.Price = getAccountPrice(Account);
    const modified = await account.update(
      { _id: Account._id },
      {
        $set: {
          NewPassword: Account.NewPassword,
          NewEmail: Account.NewEmail,
          Price: Account.Price
        }
      }
    );
    res.status(200).json({ modified, remaining: Accounts.length - 1, account: Account });
    socketIo.emit(broadcast.ACCOUNT_CREATED, Account);
  },
  getPendingAccounts: async (_: ExpressRequest, res: ExpressResponse): Promise<any> => {
    const Accounts = await account.get(
      { Email: { $exists: false } },
      { sort: { Level: -1 }, projection: { _id: 0, UserName: 1, Password: 1 } }
    );
    if (!Accounts) return res.status(500).json({ error: 'Problem finding accounts' });
    res.status(200).json({ count: Accounts.length, accounts: Accounts });
  }
};
