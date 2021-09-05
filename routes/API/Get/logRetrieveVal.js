const express = require("express");
const path = require("path");
const router = express.Router();

// Load input validation
const dirname = "/app";
const validateLogRetrievePath = "../../../validation/logs/logRetrieve";
const validateLogRetrieve = require(validateLogRetrievePath);

// Load LogsRetrieve model
const LogsRetrievePath = "../../../models/LogsRetrieve";
const LogsRetrieve = require(LogsRetrievePath);

// Load Premises model
const premisesPath = "../../../models/Premises";
const Premises = require(premisesPath);

// @route POST API/logInsertVal/logInsert
// @desc inserts id info logged on check in into db
// @access Private
router.get("/logRetrieve", async (req, res) => {
  // Form validation
  const { errors, isValid } = validateLogRetrieve(req.body);

  // Check validation
  if (!isValid) {
    return res.status(401).json({ error: errors });
  }

  // get check_out from request body
  const premises_id = req.body.premises_id;

  try {
    // find if premises id matches current school in db
    const found = await Premises.findOne({ premises_id });

    // check if admin info added to db and send res
    if (found) {
      await LogsRetrieve.find({})
        .then((logs) => res.send({ logs }))
        .catch((err = res.send({ err })));
    } else {
      res.json({ correct: false, message: "Log not found, please try again" });
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
      status: `${err.status}`,
    });
  }
});

module.exports = router;
