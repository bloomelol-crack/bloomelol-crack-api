const { account } = require('../../../database/models');

module.exports = async (req, res) => {
  const { region, count, min_level } = req.body;
  const Accounts = await account.aggregate([
    {
      $match: {
        NotInRegions: { $ne: region },
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
};
