// validateHotelSchema.js

const Joi = require("joi");
const ExpressError = require("../utils/ExpressError")

const validateHotelSchema = (req, res, next) => {
  if(!req.body.hotel.Rooms ){
      req.body.hotel.Rooms = [];
  }
  if(!req.body.hotel.Reviews ){
      req.body.hotel.Reviews = [];
  }
  if(!req.body.hotel.Reservations ){
      req.body.hotel.Reservations = [];
  }

  
  const HotelSchemaJoi = Joi.object({
    hotel: Joi.object({
      name: Joi.string().required(),
      describtion: Joi.string().required(),
      image: Joi.string().required(),
      location: Joi.string().required(),
      Rooms: Joi.array().required(),
      Reviews: Joi.array().required(),
      Reservations: Joi.array().required(), // Array of objects with two fields
    }).required(),
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
