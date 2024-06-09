const mongoose = require('mongoose');
const Room = require("./room.js");
const Review = require("./review.js");
const User= require("./user.js");
const schema =mongoose.Schema;
const { Schema, Types } = mongoose; // Importing Types from mongoose

const ReservationSchema = new Schema({
  type: { type: String, required: true },
  Date: { type: Date },
});

const imageSchema = new Schema({
  url: String,
  filename: String,

});
imageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_200')

})
const HotelSchema = new schema({
  name: { type: String, required: true },
  describtion: { type: String, required: true },
  images: [imageSchema],
  location: { type: String, required: true },
  Rooms: [{ type: schema.Types.ObjectId, ref: "Room", required: true }],
  Reviews: [{ type: schema.Types.ObjectId, ref: "Review" }],
  Reservations: [{ type: schema.Types.ObjectId, ref: "ReservationSchema" }], // Array of objects with two fields
  Owner: {
       type: schema.Types.ObjectId,
       ref: "User" ,
  },
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

