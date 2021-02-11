const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const AppLoginSchema = new Schema({
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
  front_desk_token: {
    type: String,
    required: false
  },
  visitor_station_token: {
    type: String,
    required: false
  },
  profile: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}
);

module.exports = AppLogin = mongoose.model('appLogin', AppLoginSchema, 'premises');