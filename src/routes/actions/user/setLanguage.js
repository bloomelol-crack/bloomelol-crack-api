export const setLanguage = (req, res) => {
  const { new_language } = req.body;
  const { user } = req.session;
  req.session.lang = new_language;
  req.session.save();
  res.status(200).json({ message: 'Language changed' });
  if (user) User.update({ _id: user._id }, { Language: new_language });
};
