//dependencies
const { sampleHandler } = require("./handlers/routehandlers/sampleHandler");
const { userHandler } = require("./handlers/routehandlers/userHandler");
const { tokenHandler } = require("./handlers/routehandlers/tokenHandler");
const routes = {
  user: userHandler,
  sample: sampleHandler,
  token: tokenHandler,
};

module.exports = routes;
