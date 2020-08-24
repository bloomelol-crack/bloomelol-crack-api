const uuid = require('uuid');

const { account, user } = require('../../database/models');
const rollbar = require('../../utils/rollbar');
const { axios } = require('../../utils/request');
const { sort } = require('../../utils/redis');
const { compare, encrypt } = require('../../utils/passwords');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const Users = await user.get({ Email: email });
    if (!Users) return res.status(500).json({ error: 'Problem finding users' });
    const [User] = Users;
    if (!User) return res.status(403).json({ error: 'Wrong email or password.' });
    if (!compare(password, User.Password)) return res.status(403).json({ error: 'Wrong email or password.' });
    req.session.user = User;
    req.session.save();
    res.status(200).json({ redirectTo: '/dashboard' });
  },
  logout: async (req, res) => {
    req.session.destroy();
    res.status(200).json({ redirectTo: '/login' });
  },
  register: async (req, res) => {
    const { name, surname, email, password } = req.body;
    let Users = await user.get({ Email: email });
    if (!Users) return res.status(500).json({ error: 'Problem finding users' });
    let [User] = Users;
    if (User) return res.status(409).json({ error: 'User with that email already exists' });
    const saved = await user.save({
      Name: `${name[0].toUpperCase()}${name.substr(1).toLowerCase()}`,
      Surname: `${surname[0].toUpperCase()}${surname.substr(1).toLowerCase()}`,
      Email: email,
      Password: await encrypt(password),
      PurchasedAccounts: []
    });
    if (!saved) return res.status(500).json({ error: 'Could not save user' });
    Users = await user.get({ Email: email });
    if (!Users) return res.status(500).json({ error: 'Problem finding users after register' });
    [User] = Users;
    if (!User) return res.status(500).json({ error: 'User not found after register.' });
    req.session.user = User;
    req.session.save();
    res.status(200).json({ redirectTo: '/dashboard' });
  },
  getCurrentUser: (req, res) => {
    if (!req.session.user)
      return res.status(404).json({ error: 'Not logged in', redirectTo: '/login', session: req.session });
    res.status(200).json({ user: req.session.user, redirectTo: '/dashboard' });
  }
};
