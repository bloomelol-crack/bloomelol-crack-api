const uuid = require('uuid');

const { account } = require('../../database/models');
const { socketIo } = require('../socket.io');
const { broadcast } = require('../socket.io/all_accounts/constants');
const { getAccountPrice } = require('../../utils/account');

module.exports = {
  setCredentials: async (req, res) => {
    const Accounts = await account.get(
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
  },
  getPendingAccounts: async (req, res) => {
    const Accounts = await account.get(
      { Email: { $exists: false } },
      { sort: { Level: -1 }, projection: { _id: 0, UserName: 1, Password: 1 } }
    );
    if (!Accounts) return res.status(500).json({ error: 'Problem finding accounts' });
    res.status(200).json({ count: Accounts.length, accounts: Accounts });
  },
  getCombo: async (req, res) => {
    const { region, count, min_level } = req.body;
    const Accounts = await account.aggregate([
      {
        $match: {
          Level: { $gte: min_level },
          Refunds: { $exists: false },
          ...(region === 'any' ? {} : { FromUrl: new RegExp(`${region}.op.gg/`) })
        }
      },
      { $sample: { size: count } },
      { $project: { _id: 0, UserName: 1, Password: 1, NewPassword: 1 } }
    ]);
    if (!Accounts) return res.status(500).json({ error: 'Problem finding accounts' });
    if (!Accounts.length)
      return res
        .status(404)
        .send(`No encontramos cuentas con nivel mayor o igual a ${min_level} en "${region}".`);
    res
      .status(200)
      .send(`${Accounts.map(acc => `${acc.UserName}:${acc.NewPassword || acc.Password}`).join('\n')}\n`);
  },
  updateAccounts: async (req, res) => {
    const { body: data } = req;
    const arrData = data.split('\n').map(reg => reg.split(/\s*\|\s*/g));
    const updates = [];
    const accountNames = [];

    for (let i = 0; i < arrData.length; i += 1) {
      const row = arrData[i];
      const UserName = row[1].split(':')[0];

      const EmailVerified = row[8].split(':')[1].trim();
      const BlueEssence = +row[3].split(':')[1].trim();
      const RP = +row[4].split(':')[1].trim();
      const Refunds = +row[5].split(':')[1].trim();
      const Champs = +row[6].split(':')[1].trim();
      const Skins = +row[7].split(':')[1].trim();
      accountNames[i] = UserName;
      updates.push(
        account.update(
          { UserName },
          {
            $set: {
              EmailVerified: EmailVerified.toLowerCase() === 'true',
              BlueEssence: !BlueEssence && BlueEssence !== 0 ? null : BlueEssence,
              RP: !RP && RP !== 0 ? null : RP,
              Refunds: !Refunds && Refunds !== 0 ? null : Refunds,
              Champs: !Champs && Champs !== 0 ? null : Champs,
              Skins: !Skins && Skins !== 0 ? null : Skins
            }
          }
        )
      );
    }
    const result = {};
    (await Promise.all(updates)).forEach((r, i) => (result[accountNames[i]] = r));
    return res.status(200).json({ result });
  }
};
