const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  type: { type: String, required: true },
  description: { type: String,  required: true },
  price: { type: Number, required: true },
  pictures: { type: String, required: true },
  max: { type: Number},
  Reservations:[{
    id:{type: String},
    Date: [{ type: Date}],
    }],
  DateCounter:[{
    Date:{type: Date},
    DateNumber:{type: Number}
  }]
});

module.exports = mongoose.model("Room", RoomSchema);