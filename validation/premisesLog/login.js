const Validator = require("validator");
const is_Empty = require("is-empty");

function validatePremisesLoginInput(data) {

  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.premises_id = !is_Empty(data.premises_id) ? data.premises_id : "";
  data.premises_password = !is_Empty(data.premises_password) ? data.premises_password : "";

  // Email checks
  if (Validator.isEmpty(data.premises_id)) {
    errors.premises_id = "Premises id field is required";
  }

  // Password checks
  if (Validator.isEmpty(data.premises_password)) {
    errors.premises_password = "Password field is required";
  }

  return {
    errors,
    isValid: is_Empty(errors)
  };
};

module.exports = validatePremisesLoginInput;