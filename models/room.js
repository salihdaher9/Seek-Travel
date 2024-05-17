const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  type: { type: String, required: true },
  description: { type: String,  required: true },
  price: { type: Number, required: true },
  pictures: [{ type: String, required: true }],
  max: { type: Number},
  currentCounter: { type: Number, required: true},
  calender:[{
    Date: { type: Date},
    empty: { type: Boolean}
  }]
});

module.exports = mongoose.model("Room", RoomSchema);