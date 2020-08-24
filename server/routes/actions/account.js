const uuid = require('uuid');

const { account } = require('../../database/models');
const { socketIo } = require('../socket.io');
const { broadcast } = require('../socket.io/constants/account');
const { getAccountPrice } = require('../../utils/account');

module.exports = {
  setCredentials: async (req, res) => {
    const Accounts = await account.get(
      { EmailVerified: false, NewPassword: { $exists: false } },
      { sort: { Level: -1 }, limit: 1 }
    );
    if (!Accounts) return res.status(500).json({ error: 'Problem finding accounts' });
    const [Account] = Accounts;
    if (!Account) return res.status(404).json({ error: 'Account not found' });
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
    res.status(200).json(Account);
    socketIo.emit(broadcast.ACCOUNT_CREATED, Account);
  },
  getPendingAccounts: async (req, res) => {
    const Accounts = await account.get(
      { Email: { $exists: false } },
      { sort: { Level: -1 }, projection: { _id: 0, UserName: 1, Password: 1 } }
    );
    if (!Accounts) return res.status(500).json({ error: 'Problem finding accounts' });
    res.status(200).json({ count: Accounts.length, accounts: Accounts });
  }
};
