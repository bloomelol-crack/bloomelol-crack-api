export const login = async (req, res) => {
  const { email, password } = req.body;
  const users = await User.get({ Email: email });
  if (!users) return res.status(500).json({ error: 'Problem finding users' });
  const [user] = users;
  if (!user) return res.status(403).json({ error: 'Wrong email or password.' });
  if (!passwords.compare(password, user.Password))
    return res.status(403).json({ error: 'Wrong email or password.' });
  req.session.user_id = user._id;
  req.session.save();
  res.status(200).json({ redirectTo: '/dashboard' });
  Login.save({ UserID: user._id, UserName: user.Name, UserSurname: user.Surname, IP: req.ip });
};
