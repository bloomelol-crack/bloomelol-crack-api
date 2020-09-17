import { account } from 'database/models';

import { REGION_MAPPING } from './constants';

export const ignoreAccounts = async (req, res) => {
  const data = req.body.trim();
  const { region } = req.params;
  if (!Object.values(REGION_MAPPING).includes(region))
    return res.status(400).json({ error: `No existe la región ${region}` });
  const usernames = data.split('\n').map(username => username.split(':')[0]);
  const where = { UserName: { $in: usernames } };
  const updated = await account.update(where, { $addToSet: { NotInRegions: region } });
  res.status(200).json({ total_accounts: usernames.length, updated_accounts: updated, where });
};
