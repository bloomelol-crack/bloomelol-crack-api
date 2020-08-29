type account = import('database/models/account').AccountDoc;
type paypalPayment = import('database/models/paypalPayment').PaypalPaymentDoc;
type request = import('database/models/request').RequestDoc;
type server = import('database/models/server').ServerDoc;
type user = import('database/models/user').UserDoc;

type Doc = account | paypalPayment | request | server | user;

interface ModelContainer {
  user?: DatabaseMethods<user>;
  account?: DatabaseMethods<account>;
  server?: DatabaseMethods<server>;
  request?: DatabaseMethods<request>;
  paypalPayment?: DatabaseMethods<paypalPayment>;
  [key: string]: any;
}
