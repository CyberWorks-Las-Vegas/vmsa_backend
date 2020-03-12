const express = require("express");
const path = require('path');
const router = express.Router();

// load tokens from config
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
} = require("../../config/token");
// Load input validation
const dirname = '/app'
const validateAppLoginInputPath = path.join(dirname, 'validation', 'appLog', 'appLogin');
const validateAppLoginInput = require(validateAppLoginInputPath);

// Load Premises model
const appLoginPath = path.join(dirname, 'models', 'appLogin');
const appLogin = require(appLoginPath);

// @route POST API/appLogVal/appLogin
// @desc Login user and return JWT token
// @access Private
router.post("/appLogin", async (req, res) => {

  // Form validation
  const { errors, isValid } = validateAppLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(401).json({ error: errors });
  }

  // get id/password from request body
  const id = req.body.premises_id;
  const profile = req.body.current_profile;
  const password = req.body.premises_password;

  try {
    // Find user by premises
    await appLogin.find({ premises_id: id })
      .then(async user => {
        // Check if user exists and handle err
        const length = user.length;
        if (length === 0) {
          throw new Error('premises id doesnt exist')
        };

        // destructure Id from object in array
        const userIdArray = user.map(prop => prop.premises_id);
        const [premises_id] = userIdArray;
        if (profile !== 'visitor_station') {
          // destructure password from object in array
          let appPassword = `${profile}_password`
          const userPasswordArray = user.map(prop => prop[appPassword]);
          const [profilePassword] = userPasswordArray;

          // check passsword from db then create token if true
          if (premises_id === id && profilePassword === password) {
            // create access/refresh tokens
            const accessToken = createAccessToken(premises_id);
            const refreshToken = createRefreshToken(premises_id);
            const profileTokenName = `${profile}_token`
            // send refresh token to db
            await appLogin.findOneAndUpdate(
              {
                premises_id,
              },
              { [`${profileTokenName}`]: `${refreshToken}` },
              {
                new: true,
                useFindAndModify: false
              }
            );
            // send refresh token as cookie to client
            sendRefreshToken(res, refreshToken)
            // send access token as a response from server
            sendAccessToken(req, res, accessToken)
          }
        } else if (premises_id === id && profile === 'visitor_station') {
          // create access/refresh tokens
          const accessToken = createAccessToken(premises_id);
          const refreshToken = createRefreshToken(premises_id);
          const profileTokenName = `${profile}_token`
          // send refresh token to db
          await appLogin.findOneAndUpdate(
            {
              premises_id,
            },
            { [`${profileTokenName}`]: `${refreshToken}` },
            {
              new: true,
              useFindAndModify: false
            }
          );
          // send refresh token as cookie to client
          sendRefreshToken(res, refreshToken)
          // send access token as a response from server
          sendAccessToken(req, res, accessToken)
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
