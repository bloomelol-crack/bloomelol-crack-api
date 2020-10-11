import { getOrder } from './pay_link';
import { getPaymentStatus } from './payment_status';
import { captureOrder } from './capture_order';

globalThis.paypal = { getOrder, getPaymentStatus, captureOrder };
