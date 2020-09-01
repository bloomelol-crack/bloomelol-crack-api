const { LANGUAGES } = require('./constants');

module.exports = (req, res) => {
  const { lang, user: User } = req.session;
  if (lang) return res.status(200).json({ language: lang });
  if (User) return res.status(200).json({ language: User.Language });
  req.session.lang = LANGUAGES.EN;
  req.session.save();
  return res.status(200).json({ language: req.session.lang });
};
