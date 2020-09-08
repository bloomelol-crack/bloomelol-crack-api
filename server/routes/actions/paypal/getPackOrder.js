const { getOrder } = require('../../../utils/paypal');
const { getLevelFilter } = require('../../../utils/packs');
const { account } = require('../../../database/models');

const { PACKS } = require('./constants');

module.exports = async (req, res) => {
  const { pack_name } = req.query;
  const pack = PACKS[pack_name];
  const { _id: user_id } = req.session.user || {};

  if (!user_id) return res.status(403).json({ error: 'Not logged in' });
  if (!pack) return res.status(500).json({ error: `Pack ${pack_name} not defined` });

  const levelFilter = getLevelFilter(pack);

  const Accounts = await account.get(
    {
      Level: levelFilter,
      EmailVerified: pack.email_verified,
      PaypalPaymentID: { $exists: false },
      UserID: { $exists: false }
    },
    { limit: pack.count }
  );
  if (!Accounts) return res.status(500).json({ error: 'Error searching Account' });
  if (Accounts.length < pack.count)
    return res.status(404).json({ error: `Out of stock, ${Accounts.length}/${pack.count} accounts found` });
  const { link, order } = await getOrder(user_id, pack.price, 'USD');
  if (!link) return res.status(500).json({ error: 'Could not get a payment link' });
  req.session.order_id = order.id;
  req.session.account_ids = Accounts.map(acc => acc._id);
  req.session.save(() => {
    res.status(200).json({ payment_link: link, order_id: order.id });
  });
};
