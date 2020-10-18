exports.ELOS = {
  UNRANKED: 'unranked',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
  MASTER: 'master',
  CHALLENGER: 'challenger'
};

exports.ELO_PRICES = {
  [exports.ELOS.UNRANKED]: 0,
  [exports.ELOS.GOLD]: 10,
  [exports.ELOS.PLATINUM]: 15,
  [exports.ELOS.DIAMOND]: 26.5,
  [exports.ELOS.MASTER]: 35,
  [exports.ELOS.CHALLENGER]: 55.55
};
