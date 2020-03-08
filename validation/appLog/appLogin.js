const Validator = require("validator");
const is_Empty = require("is-empty");

function validateAppLoginInput(data) {

  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.current_profile = !is_Empty(data.current_profile) ? data.current_profile : "";
  data.profile_password = !is_Empty(data.profile_password) ? data.profile_password : "";

  // Profile checks
  if (Validator.isEmpty(data.current_profile)) {
    errors.current_profile = "Premises id field is required";
  }

  // Password checks
  if (Validator.isEmpty(data.profile_password)) {
    errors.profile_password = "Password field is required";
  }

  return {
    errors,
    isValid: is_Empty(errors)
  };
};

module.exports = validateAppLoginInput;