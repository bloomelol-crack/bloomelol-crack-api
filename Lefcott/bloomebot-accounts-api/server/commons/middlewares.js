const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const express = require('express');

require('./env');
const redis = require('./redis');
const rollbar = require('./rollbar');

const app = express();
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
app.get('/:test', (req, res) => res.send({ params: req.params, headers: req.headers }));

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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => res.status(200).send('Hello World!'));
app.get('/checkip', (req, res) => res.status(200).send(req.ip));
app.use('/api', router);

console.log('Listen');
try {
  app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT} with environment ${process.env.NODE_ENV}`);
  });
} catch (e) {
  console.log('Could not listen in port', process.env.PORT);
}

module.exports = { app, router, sessionMiddleware };
