export const logout = async (req, res) => {
  req.session.destroy();
  res.status(200).json({ redirectTo: '/login' });
};
