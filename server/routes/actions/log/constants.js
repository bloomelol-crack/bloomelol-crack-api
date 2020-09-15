module.exports = {
  PACKS: {
    BASIC: {
      name: 'BASIC',
      email_verified: true,
      from_level: 30,
      to_level: 99,
      count: 10,
      price: 5.03
    },
    GOOD_LUCK: {
      name: 'GOOD_LUCK',
      count: 25,
      price: 5,
      filter: {
        Level: { $type: 10 },
        $or: [{ EmailVerified: true }, { EmailVerified: false, NewPassword: { $exists: true } }]
      }
    },
    ADVANCED: {
      name: 'ADVANCED',
      email_verified: true,
      from_level: 100,
      to_level: 199,
      count: 10,
      price: 10.04
    },
    PREMIUM: {
      name: 'PREMIUM',
      email_verified: true,
      from_level: 200,
      to_level: null,
      count: 10,
      price: 15.05
    }
  }
};