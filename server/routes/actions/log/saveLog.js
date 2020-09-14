const { log } = require('../../../database/models');

module.exports = async (req, res) => {
  const { data } = req.body;

  const saved = await log.save({ Data: data });
  if (!saved) return res.status(500).json({ error: 'Could not save data' });
  res.status(200).json({ message: 'Data saved' });
};
