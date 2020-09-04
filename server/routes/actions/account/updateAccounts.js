const moment = require('moment');

const { account } = require('../../../database/models');

const { REGION_MAPPING } = require('./constants');

module.exports = async (req, res) => {
  const data = req.body.trim();
  const arrData = data.split('\n').map(reg => reg.split(/\s*\|\s*/g));
  const updates = [];
  const accountNames = [];

  for (let i = 0; i < arrData.length; i += 1) {
    const row = arrData[i];
    if (row.length === 1) continue;
    const [UserName, Password] = row[1].split(':');
    if (row.length === 3) {
      const code = row[2].replace(/\s+/g, '').toLowerCase();

      continue;
    }

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
              // Level,
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
  const details = {};
  const summary = {};
  const resultMapper = {
    0: 'not_updated',
    1: 'updated',
    true: 'created',
    null: 'error'
  };
  (await Promise.all(updates)).forEach((r, i) => {
    const result = resultMapper[r] || 'unknown';
    details[accountNames[i]] = result;
    if (!summary[result]) summary[result] = 0;
    summary[result] += 1;
  });
  return res.status(200).json({ summary, details, arrData });
};
