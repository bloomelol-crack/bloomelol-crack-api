import geoip from 'geoip-lite';

export const ipInfo = async (req, res) => {
  const { ip } = req.params;
  const info = geoip.lookup(ip);
  if (!info) return res.status(500).json({ error: 'Error searching IP' });
  res.status(200).json({ ip_info: info });
};
