//dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routehandlers/notFoundHandler");
// module scaffolding
const handler = {};

// handle Request Response
handler.handleRegRes = (reg, res) => {
  // request handling
  // get the url and parse it
  const prasedUrl = url.parse(reg.url, true);
  const path = prasedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = reg.method.toLowerCase();
  const queryStringObject = prasedUrl.query;
  const headersObject = reg.headers;

  const requestProperties = {
    prasedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  reg.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  reg.on("end", () => {
    realData += decoder.end();
    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);
      //return the final response
      res.writeHead(statusCode);
      res.end(payloadString);
    });
    // response handle
    res.end("Hello Programmers");
  });
};

module.exports = handler;
