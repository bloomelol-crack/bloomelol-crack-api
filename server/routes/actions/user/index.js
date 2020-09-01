const login = require('./login');
const register = require('./register');
const logout = require('./logout');
const getCurrentUser = require('./current');
const getLanguage = require('./getLanguage');
const setLanguage = require('./setLanguage');

module.exports = {
  login,
  logout,
  register,
  getCurrentUser,
  getLanguage,
  setLanguage
};
