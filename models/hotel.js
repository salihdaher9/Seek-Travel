const mongoose = require('mongoose');
const Room = require("./room.js");
const Review = require("./review.js");
const schema =mongoose.Schema;
const { Schema, Types } = mongoose; // Importing Types from mongoose

const HotelSchema = new schema({
  name: { type: String, required: true },
  describtion: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  Rooms: [{ type: schema.Types.ObjectId, ref: "Room", required: true }],
  Reviews: [{ type: schema.Types.ObjectId, ref: "Review"}]
});



HotelSchema.post('findOneAndDelete',async function(hotel){
  if (hotel.Rooms.length>0) {
    await Room.deleteMany({ _id: { $in: hotel.Rooms } });
  }
  if (hotel.Reviews.length > 0) {
    await Review.deleteMany({ _id: { $in: hotel.Reviews } });
  }


})

module.exports = mongoose.model("Hotel", HotelSchema);

