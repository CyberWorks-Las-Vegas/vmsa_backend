const express = require("express");
const path = require('path');
const router = express.Router();





// Load input validation
const dirname = '/app'
const validateLogInsertPath = path.join(dirname, 'validation', 'logs', 'logsInsert');
const validateLogInsert = require(validateLogInsertPath);

// Load Premises model
const logsPath = path.join(dirname, 'models', 'Logs');
const Logs = require(logsPath);

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

  // get check in info from request body
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const check_in = req.body.check_in;
  const check_out = '';
  const license_id = req.body.license_id;
  const total_time = '';

  try {
    // a document instance
    let newLogEntry = new Logs({ first_name, last_name, check_in, check_out, license_id, total_time });

    // save model to database
    await newLogEntry
      .save()
      .then(result => {
        res.send({
          updated: true,
          log_id: result._id
        })
      })
      .catch(err => res.send({
        err,
        updated: false
      }))
  } catch (err) {
    res.send({
      error: `${err.message}`,
      status: `${err.status}`
    });
  };
});

module.exports = router;
