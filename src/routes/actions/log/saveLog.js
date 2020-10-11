/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res */
export const saveLog = async (req, res) => {
  const { data } = req.body;

  const saved = await Log.save({ IP: req.ip, Data: data });
  if (!saved) return res.status(500).json({ error: 'Could not save data' });
  res.status(200).json({ message: 'Data saved' });
};
