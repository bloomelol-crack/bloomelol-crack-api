const { user } = require('../../../database/models');
const { encrypt } = require('../../../utils/passwords');

module.exports = async (req, res) => {
  const { name, surname, email, password } = req.body;
  let Users = await user.get({ Email: email });
  if (!Users) return res.status(500).json({ error: 'Problem finding users' });
  let [User] = Users;
  if (User) return res.status(409).json({ error: 'User with that email already exists' });
  const saved = await user.save({
    Name: `${name[0].toUpperCase()}${name.substr(1).toLowerCase()}`,
    Surname: `${surname[0].toUpperCase()}${surname.substr(1).toLowerCase()}`,
    Email: email,
    Password: await encrypt(password)
  });
  if (!saved) return res.status(500).json({ error: 'Could not save user' });
  Users = await user.get({ Email: email });
  if (!Users) return res.status(500).json({ error: 'Problem finding users after register' });
  [User] = Users;
  if (!User) return res.status(500).json({ error: 'User not found after register.' });
  req.session.user = User;
  req.session.save();
  res.status(200).json({ redirectTo: '/dashboard' });
};
