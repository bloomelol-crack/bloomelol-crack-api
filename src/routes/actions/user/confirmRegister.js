import env from 'env.json';

export const confirmRegister = async (req, res) => {
  const { confirmID } = req.params;
  const users = await User.get({ ConfirmID: confirmID });

  if (!users) return res.status(500).json({ error: 'Error searching users' });
  if (!users.length) return res.status(404).json({ error: 'User not found' });
  const [user] = users;
  if (user.EmailVerified) return res.redirect(env.WEB_BASE_URL);
  user.EmailVerified = true;
  req.session.user = user;
  res.redirect(env.WEB_BASE_URL);
  User.update({ _id: user._id }, { $set: { EmailVerified: true } });
};
