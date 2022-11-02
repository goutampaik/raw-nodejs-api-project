//dependencies
const http = require("http");
const environments = require("./helpers/environments");
const { handleRegRes } = require("./helpers/handleRegRes");
const data = require("./lib/data");

//app object - module scaffolding
const app = {};

// testing file system

//create data
// data.create('test', 'newFile', {name:'Bangladesh', language: 'Bangla'}, (err) => {
//   console.log(`Error was`, err);
// });

//read data
// data.read("test", "newFile", (err, data) => {
//   console.log(err, data);
// });

//update data
// data.update("test", "newFile", { name: "India", language: "Hindi" }, (err) => {
//   console.log(err);
// });
//delete data
// data.delete("test", "newFile", (err) => {
//   console.log(err);
// });

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
