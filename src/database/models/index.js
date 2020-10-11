import { getResolvers } from '../resolvers';

import { account } from './account';
import { log as _log } from './log';
import { login } from './login';
import { message } from './message';
import { paypalPayment } from './paypalPayment';
import { payment } from './payment';
import { request } from './request';
import { server } from './server';
import { user } from './user';

globalThis.Account = getResolvers(account);
globalThis.Log = getResolvers(_log);
globalThis.Login = getResolvers(login);
globalThis.Message = getResolvers(message);
globalThis.Payment = getResolvers(payment);
globalThis.PaypalPayment = getResolvers(paypalPayment);
globalThis.Request = getResolvers(request);
globalThis.Server = getResolvers(server);
globalThis.User = getResolvers(user);
