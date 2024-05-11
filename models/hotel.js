const mongoose = require('mongoose');
const schema =mongoose.Schema;

const HotelSchema = new schema({
  name: String,
  describtion: String,
  image: String,
  location: String,
  rooms:[String]
});



module.exports = mongoose.model('Hotel', HotelSchema);