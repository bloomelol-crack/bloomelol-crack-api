export const PACKS = {
  BASIC: {
    name: 'BASIC',
    type: 'verified_accounts',
    email_verified: true,
    from_level: 30,
    to_level: 99,
    count: 10,
    price: 5.03
  },
  GOOD_LUCK: {
    name: 'GOOD_LUCK',
    type: 'verified_accounts',
    count: 25,
    price: 5,
    filter: {
      Level: { $type: 10 },
      $or: [{ EmailVerified: true }, { EmailVerified: false, NewPassword: { $exists: true } }]
    }
  },
  ADVANCED: {
    name: 'ADVANCED',
    type: 'verified_accounts',
    email_verified: true,
    from_level: 100,
    to_level: 199,
    count: 10,
    price: 10.04
  },
  PREMIUM: {
    name: 'PREMIUM',
    type: 'verified_accounts',
    email_verified: true,
    from_level: 200,
    to_level: null,
    count: 10,
    price: 15.05
  },
  PACK_1: {
    name: 'PACK_1',
    type: 'non_verified_accounts',
    email_verified: false,
    from_level: 30,
    to_level: null,
    count: 25,
    price: 5
  },
  PACK_2: {
    name: 'PACK_2',
    type: 'non_verified_accounts',
    email_verified: false,
    from_level: 30,
    to_level: null,
    count: 50,
    price: 9
  },
  PACK_3: {
    name: 'PACK_3',
    type: 'non_verified_accounts',
    email_verified: false,
    from_level: 30,
    to_level: null,
    count: 100,
    price: 16
  }
};
