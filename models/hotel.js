const mongoose = require('mongoose');
const schema =mongoose.Schema;

const HotelSchema = new schema({
  name: { type: String, required: true },
  describtion: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  rooms: [String],
});



module.exports = mongoose.model('Hotel', HotelSchema);