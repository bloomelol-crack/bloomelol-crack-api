import { account } from 'database/models';

export const getCombo = async (req, res) => {
  const { region, count, min_level, not_in_regions } = req.body;
  let notFoundOnRegion = false;
  let Accounts = await account.get(
    {
      NotInRegions: { $ne: region },
      Level: { $gte: min_level },
      Refunds: { $exists: false },
      ...(region === 'any' ? {} : { FromUrl: new RegExp(`${region}.op.gg/`) }),
      ...(not_in_regions ? { NotInRegions: { $elemMatch: { $in: not_in_regions } } } : {})
    },
    { limit: count, sort: { Level: -1 }, projection: { _id: 0, UserName: 1, Password: 1, NewPassword: 1 } }
  );
  if (!Accounts) return res.status(500).json({ error: 'Problem finding accounts' });
  if (!Accounts.length) {
    notFoundOnRegion = true;
    Accounts = await account.get(
      {
        NotInRegions: { $ne: region },
        Level: { $gte: min_level },
        Refunds: { $exists: false }
      },
      { limit: count, sort: { $Level: -1 }, projection: { _id: 0, UserName: 1, Password: 1, NewPassword: 1 } }
    );
    if (!Accounts) return res.status(500).json({ error: 'Problem finding accounts' });
  }
  if (!Accounts.length)
    return res
      .status(404)
      .send(`No encontramos cuentas con nivel mayor o igual a ${min_level} en "${region}".`);
  res
    .status(200)
    .send(
      `${
        notFoundOnRegion
          ? `INFO: ESTAS CUENTAS SON DE TODAS LAS REGIONES (no encontramos en "${region}.op.gg")\n\n`
          : ''
      }${Accounts.map(acc => `${acc.UserName}:${acc.NewPassword || acc.Password}`).join('\n')}\n`
    );
};
