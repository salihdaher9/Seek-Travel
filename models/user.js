const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Hotel = require("./hotel");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Reservations: [
    {
      hotelId: {
        type: Schema.Types.ObjectId,
        ref: "Hotel"
      },
      Roomid: {
        type: Schema.Types.ObjectId,
        ref: "Room"
      },
      Date: [{ type: Date }],
    },
  ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);