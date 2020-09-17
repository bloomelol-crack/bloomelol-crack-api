import { user } from 'database/models';

export const setLanguage = (req, res) => {
  const { new_language } = req.body;
  const { user: User } = req.session;
  req.session.lang = new_language;
  req.session.save();
  res.status(200).json({ message: 'Language changed' });
  if (User) user.update({ _id: User._id }, { Language: new_language });
};
