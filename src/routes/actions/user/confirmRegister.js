import { user } from 'database/models';
import env from 'env.json';

export const confirmRegister = async (req, res) => {
  const { confirmID } = req.params;
  const Users = await user.get({ ConfirmID: confirmID });

  if (!Users) return res.status(500).json({ error: 'Error searching users' });
  if (!Users.length) return res.status(404).json({ error: 'User not found' });
  const [User] = Users;
  if (User.EmailVerified) return res.redirect(env.WEB_BASE_URL);
  User.EmailVerified = true;
  req.session.user = User;
  res.redirect(env.WEB_BASE_URL);
  user.update({ _id: User._id }, { $set: { EmailVerified: true } });
};
