/* eslint-disable no-await-in-loop */
import { check } from '@lefcott/filter-json';
import tor from 'tor-request';

import { TOR_PASSWORD } from 'env.json';

import { wait } from 'utils/wait';
import { getCookies } from 'utils/cookies';
import { RequestConfig, RequestResponse } from 'utils/request';
import { arrayOfIndexes } from 'utils/arrays';

tor.TorControlPort.password = TOR_PASSWORD;
const limits = [
  {
    max: 20,
    current: 0,
    applyWhen: { url: 'https://auth.riotgames.com/api/v1/authorization' },
    limitWhen: { 'body.error': 'rate_limited' }
  }
];
/**
 * @typedef {object} TorOptions Options for Tor request
 * @property {string} url
 * @property {string} method
 * @property {*} headers
 * @property {*} data
 */
/**
 * @typedef {object} TorConfiguration Configuration for the request
 * @property {TorOptions} Configuration.options
 * @property {number} Configuration.timemout
 * @property {string} Configuration.id
 */
/**
 * Makes a request with Tor
 * @param {TorConfiguration} Configuration Configuration for the request
 */
interface TorResponse {
  status: number;
  statusCode: number;
  body: {} | string;
  headers: { [key: string]: any };
}
function TorRequest({ options, timeout = 30000 }: RequestConfig) {
  return new Promise<RequestResponse | false | null>(async resolve => {
    let resolved = false;
    const timeoutId = setTimeout(() => {
      resolved = true;
      resolve(false);
    }, timeout);
    const torOptions = {
      uri: options.url,
      method: options.method,
      json: options.data,
      gzip: true,
      headers: options.headers
    };
    tor.request(torOptions, (error: Error, response: TorResponse, body: object) => {
      if (resolved) return;
      clearTimeout(timeoutId);
      if (error) {
        console.error(error);
        return resolve(null);
      }
      const { statusCode: status, headers } = response;
      resolve({ status, id: '', body, headers });
    });
  });
}

let restartTorPromise: Promise<boolean> | null = null;
let currentIP: Symbol | string = Symbol('IP');
const maxIPTries = 30;

const restartTor = async () => {
  if (restartTorPromise) return restartTorPromise;
  restartTorPromise = new Promise(async resolve => {
    const newTorSession = () =>
      tor.newTorSession(async (error: Error) => {
        console.log('Start Waiting');
        error && console.error(error);
        await wait(4000);
        let currentIPTry = 0;
        while (currentIPTry < maxIPTries) {
          const ipResponse = await TorRequest({ options: { url: 'http://checkip.amazonaws.com' } });
          if (!ipResponse || ipResponse.status !== 200) {
            console.log('BAD IP RESPONSE', ipResponse);
            resolve(true);
            restartTorPromise = null;
            for (let ii = 0; ii < limits.length; ii += 1) limits[ii].current = 0;
            return;
          }
          const newIP = (<string>ipResponse.body).trim();
          console.log('\nGot IP', newIP, '\n');
          if (newIP !== currentIP) {
            console.log('\nDifferent than', currentIP, '\n');
            currentIP = newIP;
            resolve(true);
            restartTorPromise = null;
            for (let ii = 0; ii < limits.length; ii += 1) limits[ii].current = 0;
            return;
          }
          currentIPTry += 1;
        }
        newTorSession();
      });
    newTorSession();
  });
  return restartTorPromise;
};

/**
 * Checks rate and makes request with Tor
 * @param {TorConfiguration[]} configs Configuration for the request
 */
async function UnlimitedTorRequest(configs: RequestConfig[]): Promise<(boolean | RequestResponse | null)[]> {
  const limitSums = [];
  if (!Array.isArray(configs)) configs = [configs];
  const _limitIndexes: number[][] = [];
  for (let i = 0; i < limits.length; i += 1) {
    limitSums[i] = 0;
    for (let ii = 0; ii < configs.length; ii += 1) {
      _limitIndexes[ii] = [];
      if (check(configs[ii].options, limits[i].applyWhen)) {
        _limitIndexes[ii].push(i);
        limitSums[i] += 1;
        if (limits[i].current + limitSums[i] > limits[i].max) {
          await restartTor();
          return UnlimitedTorRequest(configs);
        }
      }
    }
  }
  const toSumKeys = arrayOfIndexes(limitSums.length);
  for (let i = 0; i < toSumKeys.length; i += 1) limits[toSumKeys[i]].current += limitSums[toSumKeys[i]];
  const responses = [];
  for (let i = 0; i < configs.length; i += 1) {
    const config = configs[i];
    const isLast = !configs[i + 1];
    const response = await TorRequest(config);
    responses.push(response);
    if (!response) continue;
    for (let ii = 0; ii < _limitIndexes[i].length; ii += 1) {
      const limit = limits[_limitIndexes[i][ii]];
      if (check(response, limit.limitWhen)) {
        console.log('---- Detected limit, restarting...');
        await restartTor();
        return UnlimitedTorRequest(configs);
      }
    }
    if (isLast || !response || !response.headers) continue;
    const setCookie = Array.isArray(response.headers['set-cookie']) ? response.headers['set-cookie'] : null;
    if (!setCookie) continue;
    configs[i + 1].options.headers = configs[i + 1].options.headers || {};
    configs[i + 1].options.headers.cookie = getCookies(setCookie);
  }
  return responses;
}

export { UnlimitedTorRequest as Tor };

// sudo /etc/init.d/tor restart
