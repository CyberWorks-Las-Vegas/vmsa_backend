const express = require("express");
const path = require('path');
const router = express.Router();

// Load input validation
const dirname = '/app'
const validateLogInsertPath = path.join(dirname, 'validation', 'logs', 'logsInsert');
const validateLogInsert = require(validateLogInsertPath);

// Load Premises model
const premisesPath = path.join(dirname, 'models', 'Premises');
const Logs = require(premisesPath);

// @route POST API/logInsertVal/logInsert
// @desc inserts id info logged on check in into db
// @access Private
router.post("/logInsert", async (req, res) => {

  // Form validation
  const { errors, isValid } = validateLogInsert(req.body);

  // Check validation
  if (!isValid) {
    return res.status(401).json({ error: errors });
  }

  // get id/password from request body
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const check_in = req.body.check_in;
  const license_id = req.body.license_id;
  const total_time = req.body.total_time;

  try {
    // a document instance
    let newLogEntry = new Logs({ first_name, last_name, check_in, license_id, total_time });

    // save model to database
    newLogEntry.save(function (err) {
      if (err) return console.error(err);
      console.log("saved to collection.");
    });

  } catch (err) {
    res.send({
      error: `${err.message}`,
      status: `${err.status}`
    });
  };

});

module.exports = router;
