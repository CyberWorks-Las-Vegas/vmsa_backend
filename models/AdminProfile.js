const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AdminProfileSchema = new Schema({
  premises_id: {
    type: String,
    required: true
  },
  first_login: {
    type: String,
    required: true
  },
  administrator: {
    first_Name: {
      type: String,
      required: true
    },
    last_Name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    admin_Password: {
      type: String,
      required: true
    },
    front_Desk_Password: {
      type: String,
      required: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = AdminProfile = mongoose.model("adminProfile", AdminProfileSchema, 'premises');