const PACK_TYPES = {
  BASIC: 'BASIC',
  ADVANCED: 'ADVANCED',
  PREMIUM: 'PREMIUM'
};

module.exports = {
  PACK_TYPES,
  PACKS: {
    [PACK_TYPES.BASIC]: {
      FROM_LEVEL: 30,
      TO_LEVEL: 99,
      COUNT: 10,
      PRICE: 10
    },
    [PACK_TYPES.ADVANCED]: {
      FROM_LEVEL: 100,
      TO_LEVEL: 199,
      COUNT: 10,
      PRICE: 18.2
    },
    [PACK_TYPES.PREMIUM]: {
      FROM_LEVEL: 200,
      TO_LEVEL: null,
      COUNT: 10,
      PRICE: 35.45
    }
  }
};
