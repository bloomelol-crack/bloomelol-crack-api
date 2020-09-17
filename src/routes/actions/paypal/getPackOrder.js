import { getOrder } from '../../../utils/paypal';
import { getPackAccountFilter } from '../../../utils/packs';
import { account } from '../../../database/models';

import { PACKS } from './constants';

export const getPackOrder = async (req, res) => {
  const { pack_name, region } = req.query;
  const pack = PACKS[pack_name];
  const { _id: user_id } = req.session.user || {};

  if (!user_id) return res.status(403).json({ error: 'Not logged in' });
  if (!pack) return res.status(500).json({ error: `Pack ${pack_name} not defined` });

  const Accounts = await account.get(getPackAccountFilter(pack, region), { limit: pack.count });
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
