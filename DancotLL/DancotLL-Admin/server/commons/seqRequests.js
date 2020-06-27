const { default: axios } = require('axios');
const needle = require('needle');

const request = Options =>
  new Promise(resolve => {
    const [options] = Options;

    if (!options) return resolve(true);

    axios(options)
      .catch(res => console.log('Response error', JSON.stringify(res.response.data, null, 2)))
      .finally(() => resolve(request(Options.slice(1))));
  });
const Needle = requests =>
  new Promise(resolve => {
    const [opts] = requests;

    if (!opts) return resolve(true);
    const { method, url, body, options } = opts;

    needle(method, url, body, options)
      .then(response => console.log(response.body))
      .catch(res => console.log('Response error', JSON.stringify(res.response.data, null, 2)))
      .finally(() => resolve(Needle(requests.slice(1))));
  });
module.exports = request;
module.exports.needle = Needle;
