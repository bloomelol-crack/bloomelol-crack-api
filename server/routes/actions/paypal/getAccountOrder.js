const { getAccountPrice } = require('../../../utils/account');
const { getOrder } = require('../../../utils/paypal');
const { account } = require('../../../database/models');

module.exports = async (req, res) => {
  const { account_id } = req.query;
  const { _id: user_id } = req.session.user || {};

  if (!user_id) return res.status(403).json({ error: 'Not logged in' });
  const Accounts = await account.get({ _id: account_id });
  if (!Accounts) return res.status(500).json({ error: 'Error searching Account' });
  if (!Accounts.length) return res.status(404).json({ error: 'Account not found' });
  const [Account] = Accounts;
  const price = getAccountPrice(Account);
  if (price <= 0) return res.status(500).json({ error: 'There was a problem with price calculation' });
  const { link, order } = await getOrder(user_id, price, 'USD');
  if (!link) return res.status(500).json({ error: 'Could not get a payment link' });
  req.session.orders = { [order.id]: [account_id] };
  req.session.save(() => {
    res.status(200).json({ payment_link: link, order_id: order.id });
  });
};
