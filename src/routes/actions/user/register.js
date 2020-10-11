import { LANGUAGES } from 'routes/actions/user/constants';
import env from 'env.json';

export const register = async (req, res) => {
  const { name, surname, email, password } = req.body;
  let users = await User.get({ Email: email });
  if (!users) return res.status(500).json({ error: 'Problem finding users' });
  let [user] = users;
  if (user) return res.status(409).json({ error: 'User with that email already exists' });
  const ConfirmID = passwords.largeID(2);
  user = {
    Name: `${name[0].toUpperCase()}${name.substr(1).toLowerCase()}`,
    Surname: `${surname[0].toUpperCase()}${surname.substr(1).toLowerCase()}`,
    Email: email,
    Password: await passwords.encrypt(password),
    EmailVerified: false,
    ConfirmID,
    Permissions: { ViewLogins: false }
  };
  const saved = await User.save(user);
  if (!saved) return res.status(500).json({ error: 'Could not save user' });
  users = await User.get({ Email: email });
  if (!users) return res.status(500).json({ error: 'Problem finding users after register' });
  [user] = users;
  if (!user) return res.status(500).json({ error: 'User not found after register.' });
  req.session.user = user;
  req.session.save();
  res.status(200).json({ redirectTo: '/dashboard' });

  const { html, text } = emails.getEmail('register', req.session.lang || LANGUAGES.EN, {
    Name: name,
    Surname: surname,
    VerificationLink: `${env.URL_PREFIX}${env.DOMAIN_NAME}/api/confirm_register/${ConfirmID}`
  });
  const sent = await emails.send(null, email, 'Register', text, html);
  if (!sent) return rollbar.error(`Could not send email to user ${User.Name} ${User.Surname}`);
};
