const { account } = require('../../../database/models');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res */
module.exports = async (req, res) => {
  const { count } = req.query;
  const Accounts = await account.get({ Region: { $exists: true } }, { limit: count, sort: { Level: -1 } });

  if (!Accounts) return res.status(500).json({ error: 'Error searching Accounts' });
  res.status(200).json(Accounts);
};
