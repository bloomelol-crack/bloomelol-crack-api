const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const express = require('express');
// const http = require('http');

require('./env');
const redis = require('./redis');
const rollbar = require('./rollbar');

const app = express();
// const httpServer = http.createServer(app);
const sessionMiddleware = (...args) => {
  if (process.env.REQUIRE_REDIS === 'TRUE' || redis.isActive())
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

app.use('/api', router);

console.log('Listen');

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT} with environment ${process.env.NODE_ENV}`);
});

module.exports = { app, router, sessionMiddleware };
