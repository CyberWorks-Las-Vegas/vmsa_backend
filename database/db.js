// helper methods to interact with database.

const MongoClient = require('mongodb').MongoClient;

// Connects database 
function DB() {
  this.db = null;
}

// Adding functions to prototype of db function object to be used throughout app

// Connect to database by passed string/uri
DB.prototype.connect = function (uri) {
  // track what object this is pointing to
  let _this = this;
  // helps ensure a promise is returned  
  return new Promise(function (resolve, reject) {
    if (_this.db) {
      // Already connected so db resolves itself
      resolve();
    } else {
      let __this = _this;

      // Called if the promise is resolved successfuly
      MongoClient.connect(uri)
        .then(
          // Returns the new database connection
          function (database) {
            // Store the database connection
            __this.db = database;

            // Indicate request was completed succesfully,
            resolve();
          },
          // Called if the promise is rejected
          function (err) {
            console.log("Error connecting: " + err.message);

            // I and pass back
            // the error that was returned from "connect"
            // Indicate request failed & return err
            reject(err.message);
          }
        )
    }
  })
}

// Close the database connection
DB.prototype.close = function () {
  // Check if connection is open and returns if it cant then returns err
  if (this.db) {
    this.db.close()
      .then(
        function () { },
        function (error) {
          console.log("Failed to close the database: " + error.message)
        }
      )
  }
}
// Returns a promise which resolves to number of documents in collection
DB.prototype.countDocuments = function (coll) {
  // This points to passed collection object
  let _this = this;

  return new Promise(function (resolve, reject) {

    _this.db.collection(coll,
      {
        // {strict:true} means that the count operation will fail if the collection doest exist
        strict: true
      }, function (error, collection) {
        // needs to check for errs first
        if (error) {
          console.log("Could not access collection: " + error.message);
          reject(error.message);
        } else {
          collection.count()
            .then(
              // Resolve promise with count
              function (count) {
                resolve(count);
              },
              // passes back rejected promise
              function (err) {
                console.log("countDocuments failed: " + err.message);

                reject(err.message);
              }
            )
        }
      });
  })
}

DB.prototype.sampleCollection = function (coll, numberDocs) {

  // This points to passed collection object
  const _this = this;
  // Returns promise which resolves with array from collection
  return new Promise(function (resolve, reject) {

    _this.db.collection(coll,
      {
        // {strict:true} means that the count operation will fail if the collection doest exist
        strict: true
      }, function (error, collection) {
        // Error passed back from the database
        if (error) {
          console.log("Could not access collection: " + error.message);
          reject(error.message);
        } else {

          // Create cursor from the aggregation request to help return array
          const cursor = collection.aggregate([
            {
              $sample: { size: parseInt(numberDocs) }
            }],
            { cursor: { batchSize: 10 } }
          )

          // Iterate over the cursor to access each document
          // Use cursor.each() to work with individual document.

          cursor.toArray(function (error, docArray) {
            if (error) {
              console.log("Error reading fron cursor: " + error.message);
              reject(error.message);
            } else {
              resolve(docArray);
            }
          })
        }
      })
  })
}
// Return a promise that has number of documents that have been updated
DB.prototype.updateCollection = function (coll, pattern, update) {

  const _this = this;

  return new Promise(function (resolve, reject) {

    _this.db.collection(coll,
      {
        strict: true
      }, function (error, collection) {
        if (error) {
          console.log("Could not access collection: " + error.message);
          reject(error.message);
        } else {

          collection.updateMany(
            // Pattern is used to match docs from collection to the updated doc
            pattern,
            // Updated doc
            update,
            // For write concerns - doesnt wait for data to be written to secondary redundancies
            { w: 1 })
            .then(
              function (result) {
                resolve(result.result.nModified);
              },
              function (err) {
                console.log("updateMany failed: " + err.message);
                reject(err.message);
              }
            )
        }
      })
  })
}
// Takes passed array of JSON docs and writes them to collection 
DB.prototype.popCollection = function (coll, docs) {

  const _this = this;
  // Returns a promise that resolves with number of docs added
  return new Promise(function (resolve, reject) {

    _this.db.collection(coll,
      {
        strict: false
      }, function (error, collection) {
        if (error) {
          console.log("Could not access collection: " + error.message);
          reject(error.message);
        } else {

          // Verify that it's really an array
          if (!Array.isArray(docs)) {
            console.log("Data is not an array");

            // Reject the promise with a new error object
            reject({ "message": "Data is not an array" });
          } else {

            // Udates the original array by adding _id's
            try {
              // Take a copy of returned array
              var _docs = JSON.parse(JSON.stringify(docs));
            } catch (trap) {
              reject("Array elements are not valid JSON");
            }
            // Insert the array of docs
            collection.insertMany(_docs)
              .then(
                function (results) {
                  resolve(results.insertedCount);
                },
                function (err) {
                  console.log("Failed to insert Docs: " + err.message);
                  reject(err.message);
                }
              )
          }
        }
      })
  })
}
// Add document to collection
DB.prototype.addDocument = function (coll, document) {

  const _this = this;

  return new Promise(function (resolve, reject) {

    _this.db.collection(coll,
      {
        strict: false
      }, function (error, collection) {
        if (error) {
          console.log("Could not access collection: " + error.message);
          reject(error.message);
        } else {

          collection.insert(document,
            {
              w: "majority"
            })
            .then(
              function (result) {
                resolve();
              },
              function (err) {
                console.log("Insert failed: " + err.message);
                reject(err.message);
              }
            )
        }
      })
  })
}
// Return a promise that resolves with the most recent docucment from the collection 
DB.prototype.mostRecentDocument = function (coll) {

  const _this = this;

  return new Promise(function (resolve, reject) {
    _this.db.collection(coll,
      {
        strict: false
      }, function (error, collection) {
        if (error) {
          console.log("Could not access collection: " + error.message);
          reject(error.message);
        } else {

          const cursor = collection
            .find({})
            .sort({ _id: -1 })
            .limit(1);

          cursor.toArray(function (error, docArray) {
            if (error) {
              console.log("Error reading fron cursor: " + error.message);
              reject(error.message);
            } else {
              resolve(docArray[0]);
            }
          })
        }
      })
  })
}

module.exports = DB;