import session from 'express-session';
const RedisStore = require('connect-redis')(session);
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import SocketIo from 'socket.io';

import http from 'http';

import env from 'env/';

import * as redis from 'utils/redis';
import rollbar from './rollbar';

const webOrigins = env.WEB_ORIGINS.split(/\s*,\s*/g);
const App = express();
const server = http.createServer(App);
App.use(
  cors({
    origin: webOrigins,
    methods: ['get', 'GET', 'POST', 'post', 'PUT', 'put', 'PATCH', 'patch', 'DELETE', 'delete'],
    credentials: true // enable set cookie
  })
);
const SessionMiddleware = (req: any, res: any, next: any) => {
  if ((env.REQUIRE_REDIS === 'TRUE' || redis.isActive()) && req.query.session !== 'false')
    return session({
      store: new RedisStore({ client: redis }),
      secret: env.WEB_SESSION_SECRET,
      saveUninitialized: true,
      resave: false
    })(req, res, next);
  req.session = {};
  next();
};

const Router = express.Router();
App.disable('x-powered-by');
App.use(
  express.json({
    type: ['application/json', 'text/plain']
  })
);
App.use(rollbar.errorHandler());
App.use(bodyParser.urlencoded({ extended: false }));

App.use((req, res, next) => {
  const origin = req.get('origin') || '';
  if (webOrigins.includes(origin)) res.header('Access-Control-Allow-Origin', origin);
  else res.header('Access-Control-Allow-Origin', webOrigins[0]);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

App.get('/', ({}, res) => res.status(200).send('Hello World!'));
App.get('/checkip', (req, res) => res.status(200).send(req.ip));
App.use('/api', Router);

console.log('Listen');
const port = env.PORT || process.env.PORT;
try {
  server.listen(port, () => {
    console.log(`Listening on ${port} with environment ${env.NODE_ENV}`);
  });
} catch (e) {
  console.error('Could not listen in port', port);
  console.error(e);
}

export const app = App;
export const router = Router;
export const sessionMiddleware = SessionMiddleware;
export const socketIo = SocketIo.listen(server);
