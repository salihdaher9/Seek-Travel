const mongoose = require('mongoose');
const Room = require("./room.js");
const Review = require("./review.js");
const schema =mongoose.Schema;

const HotelSchema = new schema({
  name: { type: String, required: true },
  describtion: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  Rooms: [{ type: schema.Types.ObjectId, ref: "Room", required: true }],
  Reviews: [{ type: schema.Types.ObjectId, ref: "Review"}]
});

module.exports = mongoose.model("Hotel", HotelSchema);;

