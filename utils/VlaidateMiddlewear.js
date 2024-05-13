// validateHotelSchema.js

const Joi = require("joi");
const ExpressError = require("../utils/ExpressError")

const validateHotelSchema = (req, res, next) => {
  req.body.hotel.rooms = [];
  req.body.hotel.rooms = [];
  const HotelSchemaJoi = Joi.object({
    hotel: Joi.object({
      name: Joi.string().required(),
      describtion: Joi.string().required(), // Typo: 'description' instead of 'describtion'
      image: Joi.string().required(),
      location: Joi.string().required(),
      rooms: Joi.array().required(),
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
