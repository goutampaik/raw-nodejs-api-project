// dependencies
const fs = require("fs");
const path = require("path");

const lib = {};

//base derectory of the data folder

lib.basedir = path.join(__dirname, "../.data/");

//write data to file
lib.create = (dir, file, data, callback) => {
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        //convert data to string
        const stringData = JSON.stringify(data);

        // write data to file and then close it
        fs.writeFile(fileDescriptor, stringData, (err1) => {
          if (!err1) {
            fs.close(fileDescriptor, (err2) => {
              if (!err2) {
                callback(false);
              } else {
                callback("Error closing the new file!");
              }
            });
          } else {
            callback("Error writing to new file!");
          }
        });
      } else {
        callback("Could not create new file, it may already exists!");
      }
    }
  );
};

// read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

//update exsting file
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //convert the data to string
      const stringData = JSON.stringify(data);

      //truncate the file
      fs.ftruncate(fileDescriptor, (err2) => {
        if (!err2) {
          //write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err3) => {
            if (!err3) {
              //close the file
              fs.close(fileDescriptor, (err4) => {
                if (!err4) {
                  callback(false);
                } else {
                  callback("Errpr closing File!");
                }
              });
            } else {
              callback("Error Writing to file!");
            }
          });
        } else {
          callback("Error truncting file!");
        }
      });
    } else {
      callback("Error updating. File may not exist!");
    }
  });
};

//update exsting file
lib.delete = (dir, file, callback) => {
  //unlink file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error Deleting File!");
    }
  });
};

module.exports = lib;
