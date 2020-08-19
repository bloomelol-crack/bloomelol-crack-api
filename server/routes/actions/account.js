const uuid = require('uuid');

const env = require('../../commons/env');
const { account, user } = require('../../database/models');
const rollbar = require('../../commons/rollbar');
const { axios } = require('../../commons/request');
const { sort } = require('../../commons/redis');
const { compare, encrypt } = require('../../commons/passwords');

const baseUrl = env.NGROK_URL || `${env.URL_PREFIX}${env.DOMAIN_NAME}`;
const notification_url = `${baseUrl}/api/mercadopago/notification`;

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
    delete req.session.User;
    req.session.save();
    return res.status(200).json({ redirectTo: '/' });
  },
  register: async (req, res) => {
    const { name, surname, email, password } = req.body;
    let Users = await user.get({ Email: email });
    if (!Users) return res.status(500).json({ error: 'Problem finding users' });
    let [User] = Users;
    if (User) return res.status(409).json({ error: 'User with that email already exists' });
    const saved = await user.save({
      Name: name,
      Surname: surname,
      Email: email,
      Password: encrypt(password),
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
  }
};
