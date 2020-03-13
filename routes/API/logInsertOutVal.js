const express = require("express");
const path = require('path');
const router = express.Router();

// Load input validation
const dirname = '/app'
const validateLogInsertOutPath = path.join(dirname, 'validation', 'logs', 'logsInsertOut');
const validateLogInsertOut = require(validateLogInsertOutPath);

// Load Premises model
const logsPath = path.join(dirname, 'models', 'Logs');
const Logs = require(logsPath);

// @route POST API/logInsertVal/logInsert
// @desc inserts id info logged on check in into db
// @access Private
router.post("/logInsertOut", async (req, res) => {

  // Form validation
  const { errors, isValid } = validateLogInsertOut(req.body);

  // Check validation 
  if (!isValid) {
    return res.status(401).json({ error: errors });
  }

  // get check_out from request body
  const check_out = req.body.check_out;
  const license_id = req.body.license_id;

  // TODO: add in functionality to calulate total time checked in

  try {
    // find collection and update with check out info
    const found = await Logs.findOneAndUpdate(
      { license_id },
      { check_out },
      {
        new: true,
        useFindAndModify: false
      }
    );

    // check if admin info added to db and send res
    if (found) {
      res.json({ updated: true })
    } else {
      res.json({ correct: false, message: 'log not updated, please try again' })
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
      status: `${err.status}`
    });
  };
});

module.exports = router;
