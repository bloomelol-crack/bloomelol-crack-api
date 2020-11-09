import env from './env.json';

Object.keys(env).forEach(key => (process.env[key] = env[key]));
