// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: "Your Requested URL was not Found!",
  });
};

module.exports = handler;
