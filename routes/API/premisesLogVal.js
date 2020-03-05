require('dotenv/config');
const express = require("express");
const path = require('path');
const router = express.Router();

// load tokens from config
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
} = require("../../config/token")
// Load input validation
const validateLoginInputPath = path.join(__dirname, 'app', 'validation', 'premisesLog', 'login');
const validateLoginInput = require(validateLoginInputPath);

// Load Premises model
const premisesPath = path.join(__dirname, 'app', 'models', 'Premises');
const Premises = require(premisesPath);

// @route POST api/premisesLogVal/premisesLogin
// @desc Login user and return JWT token
// @access Public
router.post("/premisesLogin", async (req, res) => {

  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(401).json({ error: errors });
  }

  // get id/password from request body
  const id = req.body.premises_id;
  const password = req.body.premises_password;

  try {
    // Find user by premises
    await Premises.find({ premises_id: id })
      .then(async user => {
        // Check if user exists and handle err
        const length = user.length;
        if (length === 0) { throw new Error('premises id doesnt exist') };
        const userArr = user;
        // destructure Id from object in array
        const userIdArray = user.map(prop => prop.premises_id);
        const [premises_id] = userIdArray;
        // destructure password from object in array
        const userPasswordArray = user.map(prop => prop.premises_password);
        const [premises_password] = userPasswordArray;
        // destructure first Use from object in array
        const userFirstLoginArray = userArr.map(prop => prop.first_login);
        const [first_login] = userFirstLoginArray;

        // check passsword from db then create token if true
        if (premises_id === id && premises_password === password) {
          // create access/refresh tokens
          const accessToken = createAccessToken(premises_id);
          const refreshToken = createRefreshToken(premises_id);

          // send refresh token to db
          await Premises.findOneAndUpdate(
            { premises_id, admin_token: '' },
            { admin_token: `${refreshToken}` },
            {
              new: true,
              useFindAndModify: false
            }
          );
          res.send({ correct: true })
          // send refresh token as cookie to client
          sendRefreshToken(res, refreshToken)
          // send access token as a response from server
          sendAccessToken(req, res, accessToken, first_login)
        } else {
          res.json({
            message: 'Incorrect credentials',
            correct: false,
            status: 401
          });
        };

      }).catch(err => res.json({
        name: `${err.name}`,
        msg: `${err.message}`,
        status: `${err.status}`
      }));
  } catch (err) {
    res.send({
      error: `${err.message}`,
      status: `${err.status}`
    });
  };

});

module.exports = router;
