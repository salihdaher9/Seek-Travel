const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const RoomSchema = new Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [imageSchema],
  max: { type: Number },
  Reservations: [
    {
      id: { type: String },
      Date: [{ type: Date }],
    },
  ],
  DateCounter: [
    {
      Date: { type: Date },
      DateNumber: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Room", RoomSchema);