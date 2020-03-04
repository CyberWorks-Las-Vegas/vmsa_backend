const Validator = require("validator");
const isEmpty = require("is-empty");

function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.first_Name = !isEmpty(data.first_Name) ? data.first_Name : "";
  data.LastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.admin_Password = !isEmpty(data.admin_Password) ? data.admin_Password : "";
  data.passwordConfirm = !isEmpty(data.passwordConfirm) ? data.passwordConfirm : "";

  // Name checks
  if (Validator.isEmpty(data.first_Name)) {
    errors.first_Name = "First name field is required";
  }
  if (Validator.isEmpty(data.last_Name)) {
    errors.last_Name = "Last name field is required";
  }
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // Password checks
  if (Validator.isEmpty(data.admin_Password)) {
    errors.admin_Password = "Administrator password field is required";
  }
  if (Validator.isEmpty(data.front_Desk_Password)) {
    errors.front_Desk_Password = "Front desk password field is required";
  }
  if (!Validator.isLength(data.admin_Password, { min: 6, max: 15 })) {
    errors.admin_Password = "Administrator password must be at least 6 characters with a max length of 15";
  }
  if (!Validator.isLength(data.front_Desk_Password, { min: 6, max: 15 })) {
    errors.front_Desk_Password = "Front desk password must be at least 6 characters with a max length of 15";
  }
  if (Validator.equals(data.admin_Password, data.front_Desk_Password)) {
    errors.front_Desk_Password = "Passwords must not match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateRegisterInput;
