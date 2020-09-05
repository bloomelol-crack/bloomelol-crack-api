const { getOrder } = require('../../../utils/paypal');
const { account } = require('../../../database/models');

const { PACKS } = require('./constants');

module.exports = async (req, res) => {
  const { pack_type } = req.query;
  const pack = PACKS[pack_type];
  const { _id: user_id } = req.session.user || {};

  if (!user_id) return res.status(403).json({ error: 'Not logged in' });
  if (!pack) return res.status(500).json({ error: `Pack ${pack_type} not defined` });

  const levelFilter = { $gte: pack.FROM_LEVEL };
  if (pack.TO_LEVEL) levelFilter.$lte = pack.TO_LEVEL;

  const Accounts = await account.get(levelFilter, { limit: pack.COUNT });
  if (!Accounts) return res.status(500).json({ error: 'Error searching Account' });
  if (Accounts.length !== pack.COUNT)
    return res.status(404).json({ error: `Out of stock, ${Accounts.length}/${pack.COUNT} accounts found` });
  const [Account] = Accounts;
  const { link, order } = await getOrder(user_id, pack.PRICE, 'USD');
  if (!link) return res.status(500).json({ error: 'Could not get a payment link' });
  res.status(200).json({ payment_link: link, order_id: order.id });
};
