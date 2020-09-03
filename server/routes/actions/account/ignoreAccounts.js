const moment = require('moment');

const { account } = require('../../../database/models');

const { REGION_MAPPING } = require('./constants');

module.exports = async (req, res) => {
  const data = req.body.trim();
  const { region } = req.params;
  if (!Object.values(REGION_MAPPING).includes(region))
    return res.status(400).json({ error: `No existe la región ${region}` });
  const usernames = data.split('\n').map(username => username.split(':')[0]);
  const where = { Region: region, UserName: { $in: usernames } };
  const updated = await account.update(where, { $addToSet: { NotInRegions: region } });
  res.status(200).json({ total_accounts: usernames.length, updated_accounts: updated, where });
};
