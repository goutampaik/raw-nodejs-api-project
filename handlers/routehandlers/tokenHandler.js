//dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { createRandomString } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "Request rejected",
    });
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err1, userData) => {
      let hashedpassword = hash(password);
      if (hashedpassword === parseJSON(userData).password) {
        let tokenId = createRandomString(20);
        let expiers = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone: phone,
          id: tokenId,
          expiers: expiers,
        };

        // store the token
        data.create("tokens", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "There was a server site problem",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password is not valid",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._token.get = (requestProperties, callback) => {
  // check the id is valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // Lookup the token
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };

      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, { error: "Requested Token was not found" });
      }
    });
  } else {
    callback(404, { error: "Requested Token was not found" });
  }
};

handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? true
      : false;
  if (id && extend) {
    data.read("tokens", id, (err1, tokenData) => {
      let tokenObject = parseJSON(tokenData);
      if (tokenObject.expiers > Date.now()) {
        tokenObject.expiers = Date.now() + 60 * 60 * 1000;
        // store the updated token
        data.update("tokens", id, tokenObject, (err2) => {
          if (!err2) {
            callback(200);
          } else {
            callback(500, { error: "There was a server site error!" });
          }
        });
      } else {
        callback(400, { error: "Token already expired!" });
      }
    });
  } else {
    callback(400, { error: "There was a problem in your request" });
  }
};

handler._token.delete = (requestProperties, callback) => {
  // check the token is valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the user
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, {
              message: "Token was successfully deleted!",
            });
          } else {
            callback(500, {
              error: "There was a server side error (2)!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a server side error!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJSON(tokenData).phone === phone &&
        parseJSON(tokenData).expiers > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
