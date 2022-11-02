//dependencies
const { sampleHandler } = require("./handlers/routehandlers/sampleHandler");
const { userHandler } = require("./handlers/routehandlers/userHandler");
const routes = {
  user: userHandler,
  sample: sampleHandler,
};

module.exports = routes;
