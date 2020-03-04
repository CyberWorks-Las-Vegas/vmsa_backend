const express = require("express");
const router = express.Router();

// Load input validation
const validateRegisterInput = require("../../validation/adminReg/adminRegistration");

// Load AdminProfile model
const AdminProfile = require("../../models/AdminProfile");

// @route POST /api/adminRegVal/register
// @desc Register user
// @access Private
router.post("/register", async (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // get id from request body
  const id = req.body.premises_id;

  try {
    await AdminProfile.findOne({ premises_id: id })
      .then(async user => {
        // Check if user exists and handle err
        const length = user.length;
        if (length === 0) { throw new Error('premises id doesnt exist') };
        // destructure Id from object in array
        const { premises_id } = user;

        // check id from db then register new user if true
        if (premises_id === id) {
          const newUser = {
            first_Name: req.body.first_Name,
            last_Name: req.body.last_Name,
            email: req.body.email,
            admin_Password: req.body.admin_Password,
            front_Desk_Password: req.body.front_Desk_Password
          }
            ;

          const oldUser = {
            first_Name: '',
            last_Name: '',
            email: '',
            admin_Password: '',
            front_Desk_Password: ''
          };

          const searchObj = Object.assign({ premises_id }, { administrator: oldUser })

          // send admin detail to db
          await AdminProfile.findOneAndUpdate(
            searchObj,
            { administrator: newUser },
            {
              new: true,
              useFindAndModify: false
            }
          );
          // check if admin info added to db and send res
          const newSearchObj = Object.assign({ premises_id }, { administrator: newUser })
          const found = await AdminProfile.findOne(newSearchObj)

          if (found) {
            res.json({ correct: true })
          } else {
            res.json({ correct: false, message: 'Admin profile not added, please try again' })
          }
        } else {
          res.json({
            message: 'premises id not found',
            correct: false,
            status: 401
          });
        };

        // // Hash password before saving in database
        // bcrypt.genSalt(10, (err, salt) => {
        //   bcrypt.hash(newUser.password, salt, (err, hash) => {
        //     if (err) throw err;
        //     newUser.password = hash;
        //     newUser
        //       .save()
        //       .then(user => res.json(user))
        //       .catch(err => console.log(err));
        //   });
        // });
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
})

module.exports = router;
