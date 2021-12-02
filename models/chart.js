var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
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
var users = mongoose.model("User", UserSchema);
module.exports = users;
