import moment from 'moment';

import { PAYMENT_PLATFORMS, ORDER_ACTIONS, ORDER_TYPES, PACKS, HACKS } from '../../../constants';

/**
 * Get Payment order
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getOrder = async (req, res) => {
  const { platform, type } = req.query;
  const { _id: user_id } = req.session.user || {};
  if (!user_id) return res.status(403).json({ error: 'Not logged in' });

  let orderAction;
  let afterOrder;
  let price;
  switch (type) {
    case ORDER_TYPES.ACCOUNT: {
      const { account_id } = req.query;
      orderAction = ORDER_ACTIONS.ASSIGN_ACCOUNTS;

      const accounts = await Account.get({ _id: account_id });
      if (!accounts) return res.status(500).json({ error: 'Error searching Account' });
      if (!accounts.length) return res.status(404).json({ error: 'Account not found' });
      const [account] = accounts;
      price = accountUtils.getAccountPrice(account);
      afterOrder = () => (req.session.account_ids = [account_id]);
      break;
    }
    case ORDER_TYPES.PACK: {
      const { pack_name, pack_region } = req.query;
      const pack = PACKS[pack_name];
      orderAction = ORDER_ACTIONS.ASSIGN_ACCOUNTS;

      if (!pack) return res.status(500).json({ error: `Pack ${pack_name} not defined` });
      ({ price } = pack);

      const accounts = await Account.aggregate([
        { $match: packs.getPackAccountFilter(pack, pack_region) },
        { $sample: { size: pack.count } }
      ]);
      if (!accounts) return res.status(500).json({ error: 'Error searching Account' });
      if (accounts.length < pack.count)
        return res
          .status(404)
          .json({ error: `Out of stock, ${accounts.length}/${pack.count} accounts found` });
      afterOrder = () => (req.session.account_ids = accounts.map(acc => acc._id));
      break;
    }
    case ORDER_TYPES.HACK: {
      const { hack_code, licence_id } = req.query;
      const hack = HACKS[hack_code];
      orderAction = ORDER_ACTIONS.ASSOCIATE_HACK;

      if (!hack) return res.status(500).json({ error: `Hack ${hack_code} is not defined` });
      const licence = hack.licences.find((_licence, i) => i === licence_id);
      if (!licence) return res.status(500).json({ error: `Licence with id ${licence_id} is not defined` });
      ({ price } = licence);
      const expirationDate = moment().add(licence.months, 'months');
      afterOrder = async payment => {
        req.session.hack = {
          Code: hack_code,
          Enabled: false,
          ExpirationDate: expirationDate,
          PaymentID: payment._id
        };
      };
      break;
    }
    default: {
      return res.status(400).json({ error: `Invalid order type: ${type}` });
    }
  }
  if (price <= 0) return res.status(500).json({ error: 'There was a problem with price calculation' });

  let order;
  let orderId;
  let payment;
  let paymentLink;
  switch (platform) {
    case PAYMENT_PLATFORMS.PAYPAL: {
      ({ link: paymentLink, order, payment } = await paypal.getOrder(user_id, price, 'USD', orderAction));
      orderId = order.id;
      if (!paymentLink) return res.status(500).json({ error: 'Could not get a payment link' });
      break;
    }
    default: {
      return res.status(400).json({ error: `Invalid platform: ${platform}` });
    }
  }

  await afterOrder(payment);
  req.session.order_id = orderId;
  req.session.order_type = type;
  req.session.save(() => {
    res.status(200).json({ payment_link: paymentLink, order_id: orderId });
  });
};
