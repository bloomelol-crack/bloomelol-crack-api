import { uuid } from 'uuidv4';

import { broadcast } from 'routes/socket.io/all_accounts/constants';

export const setCredentials = async (req, res) => {
  const userNameFilter = req.params.user_name ? { UserName: req.params.user_name } : {};
  const accounts = await Account.get(
    {
      ...userNameFilter,
      'LOL.Level': { $gte: 20 },
      NewPassword: { $exists: false },
      $or: [{ EmailVerified: false }, { EmailVerified: { $exists: false } }]
    },
    { sort: { Level: -1 } }
  );
  if (!accounts) return res.status(500).json({ error: 'Problem finding accounts' });
  if (!accounts.length) return res.status(404).json({ error: 'Accounts not found for updating' });
  const ReapedAccounts = accounts.filter(acc => acc.LOL.Region);
  const [account] = ReapedAccounts.length ? ReapedAccounts : accounts;
  const { emails } = req.body;
  account.NewPassword = uuid().replace(/-/g, '').toUpperCase() + uuid().replace(/-/g, '').substring(0, 5);
  account.NewEmail = emails[Math.floor(Math.random() * emails.length)];
  account.Price = accountUtils.getAccountPrice(account);
  account._MODIFIED = await Account.update(
    { _id: account._id },
    {
      $set: {
        NewPassword: account.NewPassword,
        NewEmail: account.NewEmail,
        Price: account.Price
      }
    }
  );
  res.status(200).json({ remaining: accounts.length - 1, account });
  socketIo.emit(broadcast.ACCOUNT_CREATED, account);
};
