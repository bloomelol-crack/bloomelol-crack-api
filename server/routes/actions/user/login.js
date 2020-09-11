const { user, login } = require('../../../database/models');
const { compare } = require('../../../utils/passwords');

module.exports = async (req, res) => {
  const { email, password } = req.body;
  const Users = await user.get({ Email: email });
  if (!Users) return res.status(500).json({ error: 'Problem finding users' });
  const [User] = Users;
  if (!User) return res.status(403).json({ error: 'Wrong email or password.' });
  if (!compare(password, User.Password)) return res.status(403).json({ error: 'Wrong email or password.' });
  req.session.user = User;
  req.session.save();
  res.status(200).json({ redirectTo: '/dashboard' });
  login.save({ UserID: User._id, UserName: User.Name, UserSurname: User.Surname, IP: req.ip });
};
