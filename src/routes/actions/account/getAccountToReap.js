/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res */
export const getAccountToReap = async (req, res) => {
  const accounts = await Account.get(
    {
      'LOL.Region': { $exists: true, $ne: undefined, $nin: ['pbe'] },
      'LOL.SessionError': { $ne: true },
      'LOL.Banned': { $exists: false },
      $or: [{ NewPassword: { $exists: true } }, { EmailVerified: true }]
    },
    { limit: 1 }
  );
  if (!accounts) return res.status(500).json({ error: 'Error finding accounts' });
  if (!accounts.length) return res.status(404).json({ message: 'No more accounts to reap' });
  res.status(200).json({ accounts });
};
