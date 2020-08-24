/* eslint-disable no-await-in-loop */
const { uuid } = require('uuidv4');
const { check } = require('@lefcott/filter-json');
const { default: axios } = require('axios');

const os = require('os');

const { request } = require('../database/models');
const { NODE_ENV } = require('../../env.json');

const { wait } = require('./wait');
const { Tor } = require('./tor');
const rollbar = require('./rollbar');

function Axios({ options, timeout = 30000, id } = {}) {
  return new Promise(resolve => {
    const timeoutId = setTimeout(() => resolve(false), timeout);

    axios(options)
      .then(response => {
        clearTimeout(timeoutId);
        const { status, data: body, headers } = response;
        resolve({ status, body, headers, id });
      })
      .catch(error => {
        clearTimeout(timeoutId);
        if (!error.response) {
          console.error(`Request Error: ${error.code}: ${error.address}`);
          return resolve(null);
        }
        const { status, data: body, headers } = error.response;
        resolve({ status, body, headers, id });
      });
  });
}

/**
 * Make request with Axios.
 * @param {object} Configuration Configuration for the request
 * @param {import("axios").AxiosRequestConfig} Configuration.options
 * @param {object|boolean} Configuration.persist DEFAULT false Persistence configuration
 * @param {boolean} Configuration.persist.error DEFAULT false Whether to persist the result of the request on error
 * @param {boolean} Configuration.persist.timeout DEFAULT false Whether to persist the result of the request on timeout
 * @param {boolean} Configuration.persist.timeout DEFAULT false Whether to persist the result of the request on timeout
 * @param {boolean} Configuration.persist.condition DEFAULT {} Whether to persist the result of the request with condition
 * @param {number} Configuration.timeout DEFAULT 30000 Timeout for the request
 * @param {string} Configuration.id DEFAULT uuidv4() Request ID
 * @returns {Promise<{ id: string, status: number, body: *, headers: * }>}
 */
const Persist = lib => async (Configuration = {}) => {
  if (!Array.isArray(Configuration)) Configuration = [Configuration];
  for (let i = 0; i < Configuration.length; i += 1) {
    Configuration[i].id = Configuration[i].id || uuid();
    Configuration[i].options.method = Configuration[i].options.method || 'get';
  }
  let responses = [];
  if (lib === 'axios') responses.push(await Axios(Configuration[0]));
  if (lib === 'tor') responses = await Tor(Configuration);
  for (let i = 0; i < Configuration.length; i += 1) {
    const config = Configuration[i];
    if (!config.persist) continue;
    const response = responses[i];
    let error;
    let timeout;
    let success;
    let condition;
    if (config.persist !== true) {
      ({ error, timeout, success, condition } = config.persist);
      if (response === null && !error) return;
      if (response === false && !timeout) return;
      if (!success || !check(response, condition)) return;
    }
    const { url, method, data, headers, params } = config.options;
    const reg = response
      ? {
        uid: config.id,
        env: NODE_ENV,
        url,
        method,
        failed: false,
        body: data,
        headers,
        params,
        response: {
          status: response.status.toString(),
          body: response.body,
          headers: response.headers
        }
      }
      : {
        uid: config.id,
        env: NODE_ENV,
        url,
        method,
        failed: true,
        body: data,
        headers,
        params,
        response: { status: 'failed' }
      };
    request.save(reg);
  }
  return lib === 'axios' ? responses[0] : lib === 'tor' ? responses : responses;
};

/**
 * Make Polling with Axios
 * @param {object} Options
 * @param {string} Options.url Polling URL
 * @param {*} Options.condition DEFAULT { status: 202 } - Condition for continue making polling on obj { status, body }
 * @param {boolean} Options.persist DEFAULT false - Whether to persist the result of the requests
 * @param {number} Options.interval DEFAULT 1000 - Interval between requests (milliseconds)
 * @param {number} Options.attempts DEFAULT 8 - Max number of request attempts
 * @param {number} Options.timeout DEFAULT 30000 - Timeout for each request
 * @param {string} id DEFAULT uuid() Polling ID
 * @returns {Promise<{ id: string, status: number, body: *, headers: * }>}
 */
const polling = (
  { url, condition = { status: 202 }, persist = false, interval = 1000, attempts = 8, timeout = 30000 },
  id = uuid()
) =>
  new Promise(resolve => {
    if (attempts === 0) {
      rollbar.error(`Polling used all attempts (${attempts}), url: ${url}`);
      return resolve(null);
    }
    setTimeout(async () => {
      const response = await Persist({ options: { method: 'get', url }, persist, timeout, id });
      if (!response) {
        rollbar.error(`Polling Failed, url: ${url}`);
        return resolve(response);
      }
      const { status, body, headers } = response;
      if (check({ status, body }, condition))
        return resolve(polling({ url, condition, persist, interval, attempts: attempts - 1 }, id));
      resolve({ id, status, body, headers });
    }, interval);
  });

module.exports = { axios: Persist('axios'), tor: Persist('tor'), polling };
