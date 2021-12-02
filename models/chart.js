var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var user = new Schema({
  january: {
    type: String,
  },
  february: {
    type: Number,
  },
  march: {
    type: Number,
  },
  april: {
    type: Number,
  },
  may: {
    type: Number,
  },
  june: {
    type: Number,
  },
  july: {
    type: Number,
  },
  august: {
    type: Number,
  },
});
var users = mongoose.model("users", user);
module.exports = users;
