const { activity } = require('../database/models');
const { axios } = require('../commons/request');
const { NODE_ENV, MERCADO_PAGO_TOKEN } = require('../commons/env');

const interval = 60000;

const execute = () =>
  setTimeout(async () => {
    console.log('Execute');
    const activities = await activity.get({
      PaymentStatus: { $nin: ['approved', 'rejected', 'cancelled', 'refunded', 'charged_back'] }
    });
    let responses = [];
    for (let i = 0; i < activities.length; i += 1) {
      const act = activities[i];
      responses.push(
        axios({
          options: {
            url: 'https://api.mercadopago.com/v1/payments/search',
            params: { external_reference: act.PaymentReference, access_token: MERCADO_PAGO_TOKEN }
          }
        })
      );
    }
    responses = await Promise.all(responses);
    const grouped = {};
    for (let i = 0; i < activities.length; i += 1) {
      const act = activities[i];
      if (!responses[i] || responses[i].status !== 200) continue;
      if (!responses[i].body.results || !responses[i].body.results.length) continue;
      const [{ status }] = responses[i].body.results;
      if (!grouped[status]) grouped[status] = { _id: { $in: [] } };
      grouped[status]._id.$in.push(act._id);
    }
    const groupKeys = Object.keys(grouped);
    for (let i = 0; i < groupKeys.length; i += 1) {
      const key = groupKeys[i];
      if (!grouped[key]._id.$in.length) continue;
      activity.update(grouped[key], { PaymentStatus: key });
    }
    execute();
  }, interval);

// if (NODE_ENV !== 'localhost') execute();
