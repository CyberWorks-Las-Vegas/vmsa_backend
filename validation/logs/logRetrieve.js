const Validator = require("validator");
const is_Empty = require("is-empty");

function validateLogInsert(data) {

  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.premises_id = !is_Empty(data.premises_id) ? data.premises_id : "";

  if (Validator.isEmpty(data.premises_id)) {
    errors.premises_id = "premises_id field is required";
  }

  return {
    errors,
    isValid: is_Empty(errors)
  };
};

module.exports = validateLogInsert;