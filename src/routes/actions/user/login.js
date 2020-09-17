import { user, login as _login } from 'database/models';
import { compare } from 'utils/passwords';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const Users = await user.get({ Email: email });
  if (!Users) return res.status(500).json({ error: 'Problem finding users' });
  const [User] = Users;
  if (!User) return res.status(403).json({ error: 'Wrong email or password.' });
  if (!compare(password, User.Password)) return res.status(403).json({ error: 'Wrong email or password.' });
  req.session.user = User;
  req.session.save();
  res.status(200).json({ redirectTo: '/dashboard' });
  _login.save({ UserID: User._id, UserName: User.Name, UserSurname: User.Surname, IP: req.ip });
};
