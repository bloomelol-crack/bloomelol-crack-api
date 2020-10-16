import moment from 'moment';

import { REGION_MAPPING } from './constants';

export const updateAccounts = async (req, res) => {
  const data = req.body.trim();
  const arrData = data.split('\n').map(reg => reg.split(/\s*\|\s*/g));
  const updates = [];
  const accountNames = [];

  for (let i = 0; i < arrData.length; i += 1) {
    const row = arrData[i];
    if (row.length === 1) continue;
    const [UserName, Password] = row[1].split(':');
    let Region = row[0].trim();
    Region = REGION_MAPPING[Region] || null;
    if (row.length === 3) {
      const code = row[2].replace(/\s+/g, '').toLowerCase();
      if (code === 'summonernotcreated')
        Account.update({ UserName }, { $set: { 'LOL.Region': Region, Level: 0 } });

      continue;
    }

    let EmailVerified = row[8].split(':')[1].trim();
    let LastPlay = row[9].replace(':', ';').split(';')[1].trim();
    let BlueEssence = +row[3].split(':')[1].trim();
    let Level = +row[2].split(':')[1].trim() || null;
    let RP = +row[4].split(':')[1].trim();
    let Refunds = +row[5].split(':')[1].trim();
    let Champs = +row[6].split(':')[1].trim();
    let Skins = +row[7].split(':')[1].trim();

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
        const accounts = await Account.get({ UserName });
        if (!accounts) return null;
        if (!accounts.length)
          return Account.save({
            UserName,
            Password,
            EmailVerified,
            LOL: {
              Region,
              BlueEssence,
              LastPlay,
              Level,
              RP,
              Refunds,
              Champs,
              Skins
            }
          });
        let eloUpdate = {};
        if (accounts[0].LOL.Level !== Level) eloUpdate = { 'LOL.Elo': 'unknown' };
        return Account.update(
          { UserName },
          {
            $set: {
              EmailVerified,
              'LOL.Region': Region,
              'LOL.LastPlay': LastPlay,
              'LOL.BlueEssence': BlueEssence,
              'LOL.Level': Level,
              'LOL.RP': RP,
              'LOL.Refunds': Refunds,
              'LOL.Champs': Champs,
              'LOL.Skins': Skins,
              ...eloUpdate
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
