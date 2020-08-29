import { AccountDoc } from 'database/models/account';

// TODO remove / 4
export const getAccountPrice = (account: AccountDoc) =>
  +(9.5 + ((account.Level || 0) - 30) / 5).toFixed(2) / 4;
