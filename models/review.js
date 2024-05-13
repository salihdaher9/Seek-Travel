const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  Stars: { type: Number, required: true,min: 0, max:5},
  comment: { type: String, required: true}
});

module.exports = mongoose.model("Review", ReviewSchema);
