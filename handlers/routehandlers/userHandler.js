//dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");
// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "Request rejected",
    });
  }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAreement =
    typeof requestProperties.body.tosAreement === "boolean" &&
    requestProperties.body.tosAreement
      ? requestProperties.body.tosAreement
      : false;

  if (firstName && lastName && phone && password && tosAreement) {
    // make sure that the user doesn't exists
    data.read("users", phone, (err, user) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAreement,
        };
        // store user to db
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, { message: "Account  was created successfully." });
          } else {
            callback(500, { error: "Could nor create account!" });
          }
        });
      } else {
        callback(500, {
          error: "there was a problem in server side!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._users.get = (requestProperties, callback) => {
  // check the phone number is valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // Lookup the user
    data.read("users", phone, (err, u) => {
      const user = { ...parseJSON(u) };

      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, { error: "Requested user was not found" });
      }
    });
  } else {
    callback(404, { error: "Requested user was not found" });
  }
};

handler._users.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  if (phone) {
    if (firstName || lastName || password) {
      // lookup the user
      data.read("users", phone, (err, uData) => {
        const userData = { ...parseJSON(uData) };
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }

          // store to database
          data.update("users", phone, userData, (err) => {
            if (!err) {
              callback(200, {
                message: "User was updated successfully.",
              });
            } else {
              callback(500, {
                error: "There was a problem in the server side!",
              });
            }
          });
        } else {
          callback(400, {
            error: "You Have a Problem in your request! (2)",
          });
        }
      });
    } else {
      callback(400, {
        error: "You Have a Problem in your request!",
      });
    }
  } else {
    callback(400, {
      error: "Invalid Phone Number. Please try again!",
    });
  }
};

handler._users.delete = (requestProperties, callback) => {
  // check the phone number is valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // lookup the user
    data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        data.delete("users", phone, (err) => {
          if (!err) {
            callback(200, {
              message: "User was successfully deleted!",
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

module.exports = handler;
