import { sessionMiddleware } from 'utils/middlewares';

export const activatePayment = {
  method: 'post',
  paths: '/paypal/activate_payment',
  middlewares: sessionMiddleware
};
