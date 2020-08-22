const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');

const http = require('http');

const { WEB_URL_PROTOCOL, WEB_DOMAIN_NAME } = require('./env');
const redis = require('./redis');
const rollbar = require('./rollbar');

const webOrigins = [`${WEB_URL_PROTOCOL}${WEB_DOMAIN_NAME}`, `${WEB_URL_PROTOCOL}www.${WEB_DOMAIN_NAME}`];
const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: webOrigins,
    methods: ['get', 'GET', 'POST', 'post', 'PUT', 'put', 'PATCH', 'patch', 'DELETE', 'delete'],
    credentials: true // enable set cookie
  })
);
const sessionMiddleware = (...args) => {
  if ((process.env.REQUIRE_REDIS === 'TRUE' || redis.isActive()) && args[0].query.session !== 'false')
    return session({
      store: new RedisStore({ client: redis }),
      secret: process.env.WEB_SESSION_SECRET,
      saveUninitialized: true,
      resave: false
    })(...args);
  args[0].session = {};
  args[2]();
};

const router = express.Router();
app.disable('x-powered-by');
app.use(
  express.json({
    type: ['application/json', 'text/plain']
  })
);
app.use(rollbar.errorHandler());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', webOrigins.join(','));
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => res.status(200).send('Hello World!'));
app.get('/checkip', (req, res) => res.status(200).send(req.ip));
app.use('/api', router);

console.log('Listen');
try {
  server.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT} with environment ${process.env.NODE_ENV}`);
  });
} catch (e) {
  console.log('Could not listen in port', process.env.PORT);
}

module.exports = { app, router, sessionMiddleware, socketIo: socketIo.listen(server) };
