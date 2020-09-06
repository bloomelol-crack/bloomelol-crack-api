const getLevelFilter = pack => {
  const levelFilter = { $gte: pack.from_level };
  if (pack.to_level) levelFilter.$lte = pack.to_level;
  return levelFilter;
};

module.exports = { getLevelFilter };
