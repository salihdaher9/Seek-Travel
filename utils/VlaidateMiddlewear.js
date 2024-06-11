// validateHotelSchema.js
const Hotel = require('../models/hotel')

const Joi = require("joi");
const ExpressError = require("../utils/ExpressError")

const validateHotelSchema = async (req, res, next) => {
  if (!req.body.hotel) {
    req.body.hotel = {};
  }
  const hotel = await Hotel.findById(req.params.id);
  // Ensure Rooms, Reviews, and Reservations are arrays if they don't exist
  if (!hotel){
     req.body.hotel.Rooms =  [];
     req.body.hotel.Reviews =  [];
     req.body.hotel.Reservations =  [];

  }
  else{
  req.body.hotel.Rooms = hotel.Rooms || [];
  req.body.hotel.Reviews = hotel.Reviews || [];
  req.body.hotel.Reservations = hotel.Reservations || [];
  }


  
  const HotelSchemaJoi = Joi.object({
    hotel: Joi.object({
      name: Joi.string().required(),
      describtion: Joi.string().required(),
      //  images: Joi.array().required(),
      location: Joi.string().required(),
      Rooms: Joi.array().required(),
      Reviews: Joi.array().required(),
      Reservations: Joi.array().required(), // Array of objects with two fields
    }).required(),
    dleteImages:Joi.array()
  });

  const result = HotelSchemaJoi.validate(req.body);

  if (!result.error) {
    next();
  } else {
    const msg = result.error.details.map((el) => el.message).join(" ");
    throw new ExpressError(msg, 400);
  }
};

module.exports = validateHotelSchema;
