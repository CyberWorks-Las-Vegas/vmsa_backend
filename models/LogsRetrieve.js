const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const LogsRetrieveSchema = new Schema({
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
    required: true
  },
  check_out: {
    type: String,
    required: true
  }
}
);

module.exports = LogsRetrieve = mongoose.model('LogsRetrieve', LogsRetrieveSchema, 'logs');