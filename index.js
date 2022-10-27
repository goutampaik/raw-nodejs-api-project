//dependencies
const http = require("http");
const  environments = require("./helpers/environments");
const { handleRegRes } = require("./helpers/handleRegRes");

//app object - module scaffolding
const app = {};

// configuration

// create server
app.createServer = () => {
  const server = http.createServer(app.handleRegRes);
  server.listen(environments.port, () => {
    console.log(`Listening to port ${environments.port}`);
  });
};

app.handleRegRes = handleRegRes;

// start the server
app.createServer();
