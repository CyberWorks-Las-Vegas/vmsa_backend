const Validator = require("validator");
const is_Empty = require("is-empty");

function validateLogInsert(data) {

  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.check_out = !is_Empty(data.check_out) ? data.check_out : "";
  data.license_id = !is_Empty(data.license_id) ? data.license_id : "";

  if (Validator.isEmpty(data.check_out)) {
    errors.check_out = "check_out field is required";
  }

  // License checks
  if (Validator.isEmpty(data.license_id)) {
    errors.license_id = "license_id id field is required";
  }

  return {
    errors,
    isValid: is_Empty(errors)
  };
};

module.exports = validateLogInsert;