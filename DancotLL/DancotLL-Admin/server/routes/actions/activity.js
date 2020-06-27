const { activity } = require('../../database/models');

module.exports = {
  report: async (req, res) => {
    const { paymentReference } = req.body;
    const result = await activity.insertOrUpdate(
      { PaymentReference: paymentReference },
      {
        PaymentReference: paymentReference,
        PaymentStatus: 'pending',
        Name: req.body.name,
        Email: req.body.email,
        Subject: req.body.subject,
        Message: req.body.message
      }
    );
    if (!result) return res.status(500).json({ error: 'Could not save activity' });
    res.status(200).json({ message: 'Activity saved OK' });
  }
};
