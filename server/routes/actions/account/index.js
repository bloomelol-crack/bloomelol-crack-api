const uuid = require('uuid');
const moment = require('moment');

const { account } = require('../../../database/models');
const { socketIo } = require('../../socket.io');
const { broadcast } = require('../../socket.io/all_accounts/constants');
const { getAccountPrice } = require('../../../utils/account');

const { REGION_MAPPING } = require('./constants');

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
    const data = req.body.trim();
    const arrData = data.split('\n').map(reg => reg.split(/\s*\|\s*/g));
    const updates = [];
    const accountNames = [];

    for (let i = 0; i < arrData.length; i += 1) {
      const row = arrData[i];
      const [UserName, Password] = row[1].split(':');

      let Region = row[0].trim();
      let EmailVerified = row[8].split(':')[1].trim();
      let LastPlay = row[9].replace(':', ';').split(';')[1].trim();
      let BlueEssence = +row[3].split(':')[1].trim();
      let Level = +row[2].split(':')[1].trim();
      let RP = +row[4].split(':')[1].trim();
      let Refunds = +row[5].split(':')[1].trim();
      let Champs = +row[6].split(':')[1].trim();
      let Skins = +row[7].split(':')[1].trim();

      Region = REGION_MAPPING[Region] || null;
      EmailVerified = EmailVerified.toLowerCase() === 'true';
      LastPlay = moment(LastPlay, 'DD/MM/YY hh:mm:ss').toDate();
      LastPlay = LastPlay.toString() === 'Invalid Date' ? undefined : LastPlay;
      BlueEssence = !BlueEssence && BlueEssence !== 0 ? null : BlueEssence;
      Level = !Level && Level !== 0 ? null : Level;
      RP = !RP && RP !== 0 ? null : RP;
      Refunds = !Refunds && Refunds !== 0 ? null : Refunds;
      Champs = !Champs && Champs !== 0 ? null : Champs;
      Skins = !Skins && Skins !== 0 ? null : Skins;
      accountNames[i] = UserName;
      updates.push(
        (async () => {
          const Accounts = await account.get({ UserName });
          if (!Accounts) return null;
          if (!Accounts.length)
            return account.save({
              UserName,
              Password,
              Region,
              EmailVerified,
              LastPlay,
              BlueEssence,
              Level,
              RP,
              Refunds,
              Champs,
              Skins
            });
          return account.update(
            { UserName },
            {
              $set: {
                Region,
                EmailVerified,
                LastPlay,
                BlueEssence,
                Level,
                RP,
                Refunds,
                Champs,
                Skins
              }
            }
          );
        })()
      );
    }
    const result = {};
    const resultMapper = {
      0: 'not updated',
      1: 'updated',
      true: 'created',
      error: 'error'
    };
    (await Promise.all(updates)).forEach((r, i) => (result[accountNames[i]] = resultMapper[r]));
    return res.status(200).json({ result });
  }
};
