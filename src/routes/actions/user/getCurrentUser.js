/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getCurrentUser = async (req, res) => {
  const { user_id } = req.session;
  if (!user_id)
    return res.status(404).json({ error: 'Not logged in', redirectTo: '/login', session: req.session });
  const users = await User.get({ _id: user_id });
  if (!users) return res.status(500).json({ error: 'Could not get user' });
  if (!users.length) return res.status(500).json({ error: 'User not found' });
  const [user] = users;
  res.status(200).json({ user, redirectTo: '/dashboard' });
};
