const Joi = require("joi");
const ExpressError = require("./ExpressError");

const validateRoomScema = (req, res, next) => {
   if(!req.body.room.Reservations){
       req.body.room.Reservations = [];

   }
   if(!req.body.room.DateCounter){
       req.body.room.DateCounter = [];

   }

   
  const RoomScema = Joi.object({
    room: Joi.object({
      type: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      pictures: Joi.string().required(),
      max: Joi.number().required(),
      Reservations: Joi.array().required(),
      DateCounter: Joi.array().required(),
    }).required(),
  });
  const result = RoomScema.validate(req.body);

  if (!result.error) {
    next();
  } else {
    const msg = result.error.details.map((el) => el.message).join(" ");
    throw new ExpressError(msg + ": review middlewear", 400);
  }
};

module.exports = validateRoomScema;

