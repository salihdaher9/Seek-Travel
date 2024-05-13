const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  Number: { type: Number, required: true },
  price: { type: Number, required: true },
  pictures: [{ type: String, required: true }],
  calender:[{
    Date: { type: Date},
    empty: { type: Boolean}
  }]
});

module.exports = mongoose.model("Room", RoomSchema);