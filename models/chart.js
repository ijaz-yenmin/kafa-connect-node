var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Chart = new Schema({
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
var chart = mongoose.model("users", Chart);
module.exports = chart;
