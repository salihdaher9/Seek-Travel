const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  Number: { type: Number, required: true },
  price: { type: Number, required: true },
  pictures: [{ type: String, required: true }],
});

module.exports = mongoose.model("Room", RoomSchema);