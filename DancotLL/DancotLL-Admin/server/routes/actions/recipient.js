const { recipient } = require('../../database/models');

module.exports = {
  create: async (req, res) => {
    const saved = await recipient.save({ Email: req.body.email, Phone: req.body.phone });
    if (!saved) return res.status(500).json({ error: 'Could not save recipient' });
    res.status(200).json({ message: 'Recipient saved OK' });
  },
  list: async (req, res) => {
    const recipients = await recipient.get();
    if (!recipients) return res.status(500).json({ error: 'Could not search recipients' });
    if (!recipients.length) return res.status(404).json({ error: 'Recipients not found' });
    res.status(200).json({ recipients });
  },
  delete: async (req, res) => {
    const { _id } = req.params;
    const deleted = await recipient.delete({ _id });
    if (!deleted) return res.status(500).json({ error: 'Could not delete the recipient' });
    if (!deleted.deletedCount) return res.status(404).json({ error: 'Recipients not found' });
    res.status(200).json({ deleted: deleted.deletedCount });
  }
};
