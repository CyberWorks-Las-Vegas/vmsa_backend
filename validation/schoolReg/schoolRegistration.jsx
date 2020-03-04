const Validator = require("validator");
const isEmpty = require("is-empty");

function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.school_Name = !isEmpty(data.school_Name) ? data.school_Name : "";
  data.street = !isEmpty(data.street) ? data.street : "";
  data.street_Number = !isEmpty(data.street_Number) ? data.street_Number : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.zip = !isEmpty(data.zip) ? data.zip : "";

  // school name check
  if (Validator.isEmpty(data.school_Name)) {
    errors.school_Name = "First name field is required";
  }
  // street field check
  if (Validator.isEmpty(data.street)) {
    errors.street = "Street field is required";
  }
  // street_Number checks
  if (Validator.isEmpty(data.street_Number)) {
    errors.street_Number = "Street number field is required";
  } else if (!Validator.isNumeric(data.street_Number, { no_symbols: true })) {
    errors.street_Number = "Street number field is invalid";
  }
  // city field check
  if (Validator.isEmpty(data.city)) {
    errors.city = "city field is required";
  }
  // zip code field check
  if (Validator.isEmpty(data.zip)) {
    errors.zip = "Zip code field is required";
  } else if (!Validator.isNumeric(data.zip, { no_symbols: true })) {
    errors.zip = "Zip code field is invalid";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateRegisterInput;
