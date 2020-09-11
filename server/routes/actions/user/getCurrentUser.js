module.exports = (req, res) => {
  if (!req.session.user)
    return res.status(404).json({ error: 'Not logged in', redirectTo: '/login', session: req.session });
  res.status(200).json({ user: req.session.user, redirectTo: '/dashboard' });
};
