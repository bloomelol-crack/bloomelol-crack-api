/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res */
export const getReapedAccounts = async (req, res) => {
  const { count } = req.query;
  const accounts = await Account.get(
    { 'LOL.Region': { $exists: true } },
    { limit: count, sort: { 'LOL.Level': -1 } }
  );

  if (!accounts) return res.status(500).json({ error: 'Error searching Accounts' });
  res.status(200).json(accounts);
};
