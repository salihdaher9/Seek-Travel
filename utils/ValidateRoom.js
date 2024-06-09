const Joi = require("joi");
const ExpressError = require("./ExpressError");

const validateRoomScema = (req, res, next) => {
  console.log(req.body)
  console.log(req.files);

  console.log("================================================")
  if (!req.body.room) {
    req.body.room = {};
  }
  req.body.room.Reservations= []
  req.body.room.DateCounter= []
  req.body.room.images = [];


   
   
  const RoomScema = Joi.object({
    room: Joi.object({
      type: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      images: Joi.array().required(),
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

