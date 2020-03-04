// This route defines/implements a restful API

const getIP = require('external-ip')();
const request = require("react-request");
const express = require('express');
const router = express.Router();

const config = require('../config/mongoCon.js');
const DB = require('../database/db');

let publicIP; // IP address of the server running app

getIP(function (err, ip) {
  // Stores the IP address of server running app
  if (err) {
    console.log("Failed to retrieve IP address: " + err.message);
    throw err;
  }
  console.log("VMSA running on " + ip + ":" + config.expressPort);
  publicIP = ip;
});
/* TEST API START*/
// THIS ISNT PART OF API used to test connection
router.get('/', function (req, res, next) {
  const testObject = {
    "AppName": "VMSA",
    "Version": 1.0
  }
  res.json(testObject);
});

// Sends a response with the IP address of the server running this service.
router.get('/ip', function (req, res, next) {
  res.json({ "ip": publicIP });
});
// Sends a response with config of API.
router.get('/config', function (req, res, next) {
  res.json(config.client);
})

// Retrieve an array of example JSON documents from mockaroo
// Returns a promise like mongoDB
function requestJSON(requestURL) {
  return new Promise(function (resolve, reject) {

    // fixes mockaroo problem with https
    finalDocURL = requestURL.replace('https', 'http');
    // 
    request({
      url: finalDocURL,
      json: true
    },
      function (error, response, body) {
        if (error || response.statusCode != 200) {
          console.log("Failed to fetch documents: " + error.message);
          reject(error.message);
        } else {
          resolve(body);
        }
      })
  })
}

/* TEST API END*/

// Request from client to read docs from a collection
router.post('/retrieveDocs', function (req, res, next) {

	/*{
    request shape:

		MongoDBURI: string; // Connect string for MongoDB instance
		collectionName: string;
		numberDocs: number; // How many documents should be in the result set
	}
	{
    response shape:

		success: boolean;	
		documents: string;	// Sample of documents from collection
		error: string;
	}
	*/

  const requestBody = req.body;
  const database = new DB;

  database.connect(requestBody.MongoDBURI)
    .then(
      function () {
        // Returning here will pass promise to next then
        return database.sampleCollection(
          requestBody.collectionName,
          requestBody.numberDocs)
      })
    // error handling
    .then(
      function (docs) {
        return {
          "success": true,
          "documents": docs,
          "error": ""
        };
      },
      function (error) {
        console.log('Failed to retrieve sample data: ' + error);
        return {
          "success": false,
          "documents": null,
          "error": "Failed to retrieve sample data: " + error
        };
      })
    .then(
      // closes db 
      function (resultObject) {
        database.close();
        res.json(resultObject);
      }
    )
})


// Request to count the number of documents in collection
router.post('/countDocs', function (req, res, next) {
  /*
  {
    request shape:
    MongoDBURI: string; // Connect string for MongoDB instance
    collectionName: string;
  }
  
  The response will contain:
  
  {
    response shape:
    success: boolean;	
    count: number;		// The number of documents in the collection
    error: string;
  }
  */

  const requestBody = req.body;
  const database = new DB;

  database.connect(requestBody.MongoDBURI)
    .then(
      function () {
        return database.countDocuments(requestBody.collectionName)
      })
    .then(
      function (count) {
        return {
          "success": true,
          "count": count,
          "error": ""
        };
      },
      function (err) {
        console.log("Failed to count the documents: " + err);
        return {
          "success": false,
          "count": 0,
          "error": "Failed to count the documents: " + err
        };
      })
    .then(
      function (resultObject) {
        database.close();
        res.json(resultObject);
      })
})

// helps with reduce functions
function add(a, b) {
  return a + b;
}
// Request from to update all documents in a collection
router.post('/updateDocs', function (req, res, next) {

	/*
	{
    request shape:
		MongoDBURI: string; 	// Connect string for MongoDB instance
		collectionName: string;
		matchPattern: Object;	// Filter to determine which documents should 
								// be updated (e.g. '{"gender": "Male"}'')
		dataChange: Object;		// Change to be applied to each matching change
								// (e.g. '{"$set": {"mmyComment": "This is a 
								// man"}, "$inc": {"myCounter": 1}}')
		threads: number;		// How many times to repeat (in parallel) the operation
	}
	{
    reponse shape:
		success: boolean;	
		count: number;			// The number of documents updated (should be the
								// the number of documents matching the pattern
								// multiplied by the number of threads)
		error: string;
	}
	*/

  const requestBody = req.body;
  const database = new DB;

  database.connect(requestBody.MongoDBURI)
    .then(
      function () {
        // Build up a list of the operations to be performed
        let taskList = []

        for (let i = 0; i < requestBody.threads; i++) {
          taskList.push(database.updateCollection(
            requestBody.collectionName,
            requestBody.matchPattern,
            requestBody.dataChange));
        }

        // Asynchronously run all of the operations
        let allPromise = Promise.all(taskList);
        allPromise
          .then(
            function (values) {
              documentsUpdated = values.reduce(add, 0);
              return {
                "success": true,
                "count": documentsUpdated,
                "error": {}
              };
            },
            function (error) {
              console.log("Error updating documents" + error);
              return {
                "success": false,
                "count": 0,
                "error": "Error updating documents: " + error
              };
            }
          )
          // close db
          .then(
            function (resultObject) {
              database.close();
              res.json(resultObject);
            }
          )
      },
      // callback for first then to catch errs
      function (error) {
        console.log("Failed to connect to the database: " + error);
        resultObject = {
          "success": false,
          "count": 0,
          "error": "Failed to connect to the database: " + error
        };
        res.json(resultObject);
      }
    );
})

// Add a single documents from a collection
router.post('/addDoc', function (req, res, next) {

  /*
    {
      Request shape:
  
      collectionName: string,
      document: JSON document,
    }
    {
      Response shape:
      
      success: boolean,
      error: string
    }
    */

  const requestBody = req.body;
  const database = new DB;

  database.connect(config.makerMongoDBURI)
    .then(
      function () {
        // Returning will pass promise/err to then
        return database.addDocument(requestBody.collectionName, requestBody.document)
      })
    .then(
      function (docs) {
        return {
          "success": true,
          "error": ""
        };
      },
      function (error) {
        console.log('Failed to add document: ' + error);
        return {
          "success": false,
          "error": "Failed to add document: " + error
        };
      })
    .then(
      // closes db
      function (resultObject) {
        database.close();
        res.json(resultObject);
      }
    )
})

module.exports = router;