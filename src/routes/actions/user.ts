import db from 'database';
import { compare, encrypt } from 'utils/passwords';
module.exports = {
  login: async (req: ExpressRequest, res: ExpressResponse): Promise<any> => {
    const { email, password } = req.body;
    const Users = await db.user?.get({ Email: email });
    if (!Users) return res.status(500).json({ error: 'Problem finding users' });
    const [User] = Users;
    if (!User) return res.status(403).json({ error: 'Wrong email or password.' });
    if (!compare(password, User.Password)) return res.status(403).json({ error: 'Wrong email or password.' });
    if (req.session) req.session.user = User;
    if (req.session) req.session.save(() => {});
    res.status(200).json({ redirectTo: '/dashboard' });
  },
  logout: async (req: ExpressRequest, res: ExpressResponse) => {
    if (req.session) req.session.destroy(() => {});
    res.status(200).json({ redirectTo: '/login' });
  },
  register: async (req: ExpressRequest, res: ExpressResponse): Promise<any> => {
    const { name, surname, email, password } = req.body;
    let Users = await db.user?.get({ Email: email });
    if (!Users) return res.status(500).json({ error: 'Problem finding users' });
    let [User] = Users;
    if (User) return res.status(409).json({ error: 'User with that email already exists' });
    const saved = await db.user?.save({
      Name: `${name[0].toUpperCase()}${name.substr(1).toLowerCase()}`,
      Surname: `${surname[0].toUpperCase()}${surname.substr(1).toLowerCase()}`,
      Email: email,
      Password: (await encrypt(password)) || ''
    });
    if (!saved) return res.status(500).json({ error: 'Could not save user' });
    Users = await db.user?.get({ Email: email });
    if (!Users) return res.status(500).json({ error: 'Problem finding users after register' });
    [User] = Users;
    if (!User) return res.status(500).json({ error: 'User not found after register.' });
    if (req.session) req.session.user = User;
    if (req.session) req.session.save(() => {});
    res.status(200).json({ redirectTo: '/dashboard' });
  },
  getCurrentUser: (req: ExpressRequest, res: ExpressResponse): any => {
    if (!req.session?.user)
      return res.status(404).json({ error: 'Not logged in', redirectTo: '/login', session: req.session });
    res.status(200).json({ user: req.session.user, redirectTo: '/dashboard' });
  }
};
