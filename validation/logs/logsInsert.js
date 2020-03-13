const Validator = require("validator");
const is_Empty = require("is-empty");

function validateLogInsert(data) {

  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.first_name = !is_Empty(data.first_name) ? data.first_name : "";
  data.last_name = !is_Empty(data.last_name) ? data.last_name : "";
  data.check_in = !is_Empty(data.check_in) ? data.check_in : "";
  data.check_out = !is_Empty(data.check_out) ? data.check_out : "";
  data.license_id = !is_Empty(data.license_id) ? data.license_id : "";
  data.total_time = !is_Empty(data.total_time) ? data.total_time : "";

  // Name checks
  if (Validator.isEmpty(data.first_name)) {
    errors.first_name = "first_name field is required";
  }
  if (Validator.isEmpty(data.last_name)) {
    errors.last_name = "last_name field is required";
  }

  // Check in ...checks
  if (Validator.isEmpty(data.check_in)) {
    errors.check_in = "check_in field is required";
  }
  if (Validator.isEmpty(data.check_out)) {
    errors.check_out = "check_out field is required";
  }

  // License checks
  if (Validator.isEmpty(data.license_id)) {
    errors.license_id = "license_id id field is required";
  }

  // totals checks
  if (Validator.isEmpty(data.total_time)) {
    errors.total_time = "total_time id field is required";
  }

  return {
    errors,
    isValid: is_Empty(errors)
  };
};

module.exports = validateLogInsert;