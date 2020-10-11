const getLevelFilter = pack => {
  const levelFilter = pack.from_level ? { $gte: pack.from_level } : { $exists: true };
  if (pack.to_level) levelFilter.$lte = pack.to_level;
  return levelFilter;
};

const getPackAccountFilter = (pack, region) => ({
  Level: getLevelFilter(pack),
  ...(!region || region === 'any' ? {} : { Region: region }),
  ...(pack.email_verified ? { EmailVerified: pack.email_verified } : {}),
  PaymentID: { $exists: false },
  UserID: { $exists: false },
  ...(pack.filter || {})
});

globalThis.packs = { getLevelFilter, getPackAccountFilter };
