/* eslint-disable no-await-in-loop */
import { uuid } from 'uuidv4';
import { check } from '@lefcott/filter-json';
import axios from 'axios';

import db from 'database/index';
import env from 'env/';
import { Tor } from 'utils/tor';
import rollbar from 'utils/rollbar';

function Axios({ options, timeout = 30000, id = '' }: RequestConfig = { options: {} }) {
  return new Promise<boolean | RequestResponse | null>(resolve => {
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

export interface RequestConfig {
  options: import('axios').AxiosRequestConfig;
  persist?: { error?: boolean; timeout?: boolean; success?: boolean; condition?: {} } | boolean;
  timeout?: number;
  id?: string;
}
export type RequestResponse = { id: string; status: number; body: any; headers: any } | null;
const Persist = (lib: string) => async (
  Configuration: RequestConfig | [RequestConfig] = { options: {} }
): Promise<boolean | RequestResponse | null | (boolean | RequestResponse | null)[]> => {
  if (!Array.isArray(Configuration)) Configuration = [Configuration];
  for (let i = 0; i < Configuration.length; i += 1) {
    Configuration[i].id = Configuration[i].id || uuid();
    Configuration[i].options.method = Configuration[i].options.method || 'get';
  }
  let responses: (boolean | RequestResponse | null)[] = [];
  if (lib === 'axios') responses.push(await Axios(Configuration[0]));
  if (lib === 'tor') responses = await Tor(Configuration);
  for (let i = 0; i < Configuration.length; i += 1) {
    const config = Configuration[i];
    config.id = uuid();
    if (!config.persist) continue;
    const response = responses[i];
    let error;
    let timeout;
    let success;
    let condition;
    if (config.persist !== true) {
      ({ error, timeout, success, condition } = config.persist);
      if (response === null && !error) continue;
      if (response === false && !timeout) continue;
      if (!success || !check(response, condition)) continue;
    }
    const { url, method, data, headers, params } = config.options;
    const reg = response
      ? {
          uid: config.id,
          env: env.NODE_ENV,
          url: url || '',
          method: method || '',
          failed: false,
          body: data,
          headers,
          params,
          response: {
            status: typeof response === 'object' ? <string>response.status.toString() : undefined,
            body: typeof response === 'object' && response.body,
            headers: typeof response === 'object' && response.headers
          }
        }
      : {
          uid: config.id,
          env: env.NODE_ENV,
          url: url || '',
          method: method || '',
          failed: true,
          body: data,
          headers,
          params,
          response: { status: 'failed' }
        };
    db.request?.save(reg);
  }
  return lib === 'axios' ? responses[0] : lib === 'tor' ? responses : responses;
};

type PollingParameters = [
  {
    url: string;
    condition: {};
    persist?: boolean;
    interval?: number;
    attempts?: number;
    timeout?: number;
  },
  string
];
const polling = (
  ...[
    { url, condition = { status: 202 }, persist = false, interval = 1000, attempts = 8, timeout = 30000 },
    id = uuid()
  ]: PollingParameters
): Promise<boolean | RequestResponse | null> =>
  new Promise(resolve => {
    if (attempts === 0) {
      rollbar.error(`Polling used all attempts (${attempts}), url: ${url}`);
      return resolve(null);
    }
    setTimeout(async () => {
      const response = await Persist('axios')({ options: { method: 'get', url }, persist, timeout, id });
      if (typeof response !== 'object') {
        rollbar.error(`Polling Failed, url: ${url}`);
        return resolve(response);
      }
      const isArray = (x: any): x is Array<any> => Array.isArray(x);
      if (isArray(response)) return resolve(null);
      if (!response) return resolve(response);
      const { status, body, headers } = response;
      if (check({ status, body }, condition))
        return resolve(polling({ url, condition, persist, interval, attempts: attempts - 1 }, id));
      resolve({ id, status, body, headers });
    }, interval);
  });

const axiosPersist = Persist('axios');
const tor = Persist('tor');
export { polling, axiosPersist as axios, tor };
