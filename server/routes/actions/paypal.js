const env = require('../../../env.json');
const { getPayLink } = require('../../utils/paypal');
const { getAccountPrice } = require('../../utils/account');
const { account } = require('../../database/models');

module.exports = {
  getPaymentLink: async (req, res) => {
    const { account_id } = req.query;

    const Accounts = await account.get({ _id: account_id });
    if (!Accounts) return res.status(500).json({ error: 'Error searching Account' });
    if (!Accounts.length) return res.status(404).json({ error: 'Account not found' });
    const [Account] = Accounts;
    const price = getAccountPrice(Account);
    if (price <= 0) return res.status(500).json({ error: 'There was a problem with price calculation' });
    const link = await getPayLink(price, 'USD');
    if (!link) return res.status(500).json({ error: 'Could not get a payment link' });
    res.status(200).json({ payment_link: link });
  }
};
