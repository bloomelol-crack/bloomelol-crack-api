const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');

const http = require('http');

const env = require('../../env.json');

const redis = require('./redis');
const rollbar = require('./rollbar');

const webOrigins = env.WEB_ORIGINS.split(/\s*,\s*/g);
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
  if ((env.REQUIRE_REDIS === 'TRUE' || redis.isActive()) && args[0].query.session !== 'false')
    return session({
      store: new RedisStore({ client: redis }),
      secret: env.WEB_SESSION_SECRET,
      saveUninitialized: true,
      resave: false
    })(...args);
  args[0].session = {};
  args[2]();
};

const router = express.Router();
app.disable('x-powered-by');
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'text/plain') return next();
  express.json({
    type: ['application/json', 'text/plain']
  })(req, res, next);
});
app.use(rollbar.errorHandler());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const origin = req.get('origin');
  if (webOrigins.includes(origin)) res.header('Access-Control-Allow-Origin', origin);
  else res.header('Access-Control-Allow-Origin', webOrigins[0]);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => res.status(200).send('Hello World!'));
app.get('/checkip', (req, res) => res.status(200).send(req.ip));
app.use('/api', router);

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

module.exports = { app, router, sessionMiddleware, socketIo: socketIo.listen(server) };
