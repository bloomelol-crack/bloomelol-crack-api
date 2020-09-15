const redis = require('../../../utils/redis');

const { REGION_MAPPING } = require('./constants');

const programRegions = Object.keys(REGION_MAPPING);
const regions = Object.values(REGION_MAPPING);

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res */
module.exports = async (req, res) => {
  let oldRegion = await redis.Get('current_region');
  oldRegion = oldRegion || regions[0];
  const index = (regions.indexOf(oldRegion) + 1) % regions.length
  const region = regions[index];
  const programRegion = programRegions[index];
  res.status(200).json({ region, programRegion });
  redis.Set('current_region', region);
};
