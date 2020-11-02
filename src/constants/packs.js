const getPack = (name, type, email_verified, from_level, to_level, count, price) => ({
  name,
  type,
  email_verified,
  from_level,
  to_level,
  count,
  price
});

export const PACKS = {
  BASIC: getPack('BASIC', 'verified_accounts', true, 30, 99, 10, 5.03),
  GOOD_LUCK: getPack('GOOD_LUCK', 'verified_accounts', 25, 5, {
    'LOL.Level': { $type: 10 },
    $or: [{ EmailVerified: true }, { EmailVerified: false, NewPassword: { $exists: true } }]
  }),
  ADVANCED: getPack('ADVANCED', 'verified_accounts', true, 100, 199, 10, 10.04),
  PREMIUM: getPack('PREMIUM', 'verified_accounts', true, 200, null, 10, 15.05),
  PACK_1: getPack('PACK_1', 'non_verified_accounts', false, 30, null, 25, 5, {
    NewPassword: { $exists: true }
  }),
  PACK_2: getPack('PACK_2', 'non_verified_accounts', false, 30, null, 50, 9, {
    NewPassword: { $exists: true }
  }),
  PACK_3: getPack('PACK_3', 'non_verified_accounts', false, 30, null, 100, 16, {
    NewPassword: { $exists: true }
  })
};
