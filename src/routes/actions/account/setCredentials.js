import { uuid } from 'uuidv4';

import { account } from 'database/models';
import { socketIo } from 'routes/socket.io';
import { getAccountPrice } from 'utils/account';

import { broadcast } from 'routes/socket.io/all_accounts/constants';

export const setCredentials = async (req, res) => {
  const userNameFilter = req.params.user_name ? { UserName: req.params.user_name } : {};
  const Accounts = await account.get(
    {
      ...userNameFilter,
      Level: { $gte: 20 },
      NewPassword: { $exists: false }
    },
    { sort: { Level: -1 } }
  );
  if (!Accounts) return res.status(500).json({ error: 'Problem finding accounts' });
  if (!Accounts.length) return res.status(404).json({ error: 'Accounts not found for updating' });
  const ReapedAccounts = Accounts.filter(acc => acc.Region);
  const [Account] = ReapedAccounts.length ? ReapedAccounts : Accounts;
  const { emails } = req.body;
  Account.NewPassword = uuid().replace(/-/g, '').toUpperCase() + uuid().replace(/-/g, '').substring(0, 5);
  Account.NewEmail = emails[Math.floor(Math.random() * emails.length)];
  Account.Price = getAccountPrice(Account);
  Account._MODIFIED = await account.update(
    { _id: Account._id },
    {
      $set: {
        NewPassword: Account.NewPassword,
        NewEmail: Account.NewEmail,
        Price: Account.Price
      }
    }
  );
  res.status(200).json({ remaining: Accounts.length - 1, account: Account });
  socketIo.emit(broadcast.ACCOUNT_CREATED, Account);
};
