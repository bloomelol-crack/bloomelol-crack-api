const { filter } = require('@lefcott/filter-json');

const { team, azureApp } = require('../database/models');

const data = {
  // teams: team.get({}),
  // azureApps: azureApp.get({})
};

module.exports = {
  // teams: async (Filter, ...subFilters) =>
  //   (Filter && filter(await data.teams, Filter, ...subFilters)) || data.teams,
  // azureApps: async (Filter, ...subFilters) =>
  //   (Filter && filter(await data.azureApps, Filter, ...subFilters)) || data.azureApps
};
