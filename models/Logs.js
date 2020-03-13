const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const LogsSchema = new Schema({
  id: {
    type: Date,
    default: Date.now
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  check_in: {
    type: String,
    required: false
  },
  check_out: {
    type: String,
    required: false
  },
  license_id: {
    type: String,
    required: true
  },
  total_time: {
    type: String,
    required: false
  }
}
);

module.exports = Logs = mongoose.model('Logs', LogsSchema, 'logs');