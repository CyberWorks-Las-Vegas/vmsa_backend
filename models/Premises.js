const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const PremisesSchema = new Schema({
  premises_id: {
    type: String,
    required: true
  },
  premises_password: {
    type: String,
    required: true
  },
  admin_token: {
    type: String,
    required: false
  },
  first_login: {
    type: Boolean,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}
);

module.exports = Premises = mongoose.model('premisesLogin', PremisesSchema, 'premises');