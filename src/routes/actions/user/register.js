import { user } from 'database/models';
import { encrypt, largeID } from 'utils/passwords';
import { send, getEmail } from 'utils/emails';
import rollbar from 'utils/rollbar';
import { LANGUAGES } from 'routes/actions/user/constants';
import env from '../../../../env.json';

export const register = async (req, res) => {
  const { name, surname, email, password } = req.body;
  let Users = await user.get({ Email: email });
  if (!Users) return res.status(500).json({ error: 'Problem finding users' });
  let [User] = Users;
  if (User) return res.status(409).json({ error: 'User with that email already exists' });
  const ConfirmID = largeID(2);
  User = {
    Name: `${name[0].toUpperCase()}${name.substr(1).toLowerCase()}`,
    Surname: `${surname[0].toUpperCase()}${surname.substr(1).toLowerCase()}`,
    Email: email,
    Password: await encrypt(password),
    EmailVerified: false,
    ConfirmID,
    Permissions: { ViewLogins: false }
  };
  const saved = await user.save(User);
  if (!saved) return res.status(500).json({ error: 'Could not save user' });
  Users = await user.get({ Email: email });
  if (!Users) return res.status(500).json({ error: 'Problem finding users after register' });
  [User] = Users;
  if (!User) return res.status(500).json({ error: 'User not found after register.' });
  req.session.user = User;
  req.session.save();
  res.status(200).json({ redirectTo: '/dashboard' });

  const { html, text } = getEmail('register', req.session.lang || LANGUAGES.EN, {
    Name: name,
    Surname: surname,
    VerificationLink: `${env.URL_PREFIX}${env.DOMAIN_NAME}/api/confirm_register/${ConfirmID}`
  });
  const sent = await send(null, email, 'Register', text, html);
  if (!sent) return rollbar.error(`Could not send email to user ${User.Name} ${User.Surname}`);
};
